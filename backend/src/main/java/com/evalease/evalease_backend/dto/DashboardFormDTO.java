package com.evalease.evalease_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardFormDTO {
    private Long id;
    private String title;
    private String description;
    private String createdAt; 
    private LocalDateTime submittedAt; 
}