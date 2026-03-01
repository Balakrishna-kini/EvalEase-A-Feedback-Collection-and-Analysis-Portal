package com.evalease.evalease_backend.controller;

import com.evalease.evalease_backend.dto.DashboardFormDTO;
import com.evalease.evalease_backend.dto.GenericResponseDTO;
import com.evalease.evalease_backend.service.EmployeeDashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee-dashboard")
public class EmployeeDashboardController {

    @Autowired
    private EmployeeDashboardService employeeDashboardService;

   @GetMapping("/forms/{employeeId}")
    public ResponseEntity<GenericResponseDTO<Map<String, List<DashboardFormDTO>>>> getFormsForEmployee(@PathVariable Long employeeId) {
        try {
            Map<String, List<DashboardFormDTO>> forms = employeeDashboardService.getFormsForEmployee(employeeId);
            return ResponseEntity.ok(
                GenericResponseDTO.<Map<String, List<DashboardFormDTO>>>builder()
                    .success(true)
                    .data(forms)
                    .build()
            );
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                GenericResponseDTO.<Map<String, List<DashboardFormDTO>>>builder()
                    .success(false)
                    .error("Failed to retrieve forms: " + ex.getMessage())
                    .build()
            );
        }
    }

    @GetMapping("/submissions/{employeeId}/details")
    public ResponseEntity<GenericResponseDTO<List<Map<String, Object>>>> getEmployeeFeedbackHistory(@PathVariable Long employeeId) {
        try {
            List<Map<String, Object>> history = employeeDashboardService.getEmployeeFeedbackHistory(employeeId);
            return ResponseEntity.ok(
                GenericResponseDTO.<List<Map<String, Object>>>builder()
                    .success(true)
                    .data(history)
                    .build()
            );
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                GenericResponseDTO.<List<Map<String, Object>>>builder()
                    .success(false)
                    .error("Failed to retrieve history: " + ex.getMessage())
                    .build()
            );
        }
    }
}
