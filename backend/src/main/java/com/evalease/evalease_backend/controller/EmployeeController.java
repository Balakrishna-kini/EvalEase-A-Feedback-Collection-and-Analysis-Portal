package com.evalease.evalease_backend.controller;

import org.springframework.http.HttpStatus;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:8081")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Endpoint to save employee during Signup
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee) {
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(employee.getEmail());
        if (existingEmployee.isPresent()) {
            // 400 Bad Request is good for validation errors
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email already exists. Please login.");
        }
        
        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    // Endpoint to fetch employee by email during Login
    @GetMapping("/email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return ResponseEntity.ok(employee);
    }
}
