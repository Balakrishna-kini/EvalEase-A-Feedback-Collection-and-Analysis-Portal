package com.evalease.evalease_backend.controller;
import com.evalease.evalease_backend.dto.AdminDashboardStatsDTO;

import com.evalease.evalease_backend.service.FormService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin(origins = "http://localhost:8081")  // match your frontend origin
public class AdminDashboardController {

    private final FormService dashboardService;

    public AdminDashboardController(FormService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
    try {
        AdminDashboardStatsDTO stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    } catch (Exception e) {
        e.printStackTrace();  // logs error in console
        return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
    }
}

}