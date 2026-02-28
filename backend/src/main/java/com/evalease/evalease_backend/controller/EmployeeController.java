package com.evalease.evalease_backend.controller;

import com.evalease.evalease_backend.dto.AuthenticationResponse;
import com.evalease.evalease_backend.dto.LoginRequest;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.Role;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import com.evalease.evalease_backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Endpoint to save employee during Signup
    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());
        if (existingEmployee.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists. Please login.");
        }

        // Hash the password if provided, otherwise set a placeholder (for migration)
        if (employee.getPassword() != null) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        }

        // Assign default role if not provided
        if (employee.getRole() == null) {
            employee.setRole(Role.EMPLOYEE);
        }

        Employee savedEmployee = employeeRepository.save(employee);
        
        // Generate token for immediate login after signup
        String token = jwtUtil.generateToken(savedEmployee.getEmail(), savedEmployee.getRole().name());
        
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(token)
                .id(savedEmployee.getId())
                .name(savedEmployee.getName())
                .email(savedEmployee.getEmail())
                .role(savedEmployee.getRole())
                .build());
    }

    // New proper Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        Employee employee = employeeRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        String token = jwtUtil.generateToken(employee.getEmail(), employee.getRole().name());

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(token)
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole())
                .build());
    }

    // Endpoint to fetch employee by email during Login (Keeping for backward compatibility, but it's now deprecated)
    @GetMapping("/email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return ResponseEntity.ok(employee);
    }
}
