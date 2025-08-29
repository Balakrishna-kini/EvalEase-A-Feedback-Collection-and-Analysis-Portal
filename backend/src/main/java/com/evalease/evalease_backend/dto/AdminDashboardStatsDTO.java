package com.evalease.evalease_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {
    private int totalForms;
    private int responses;
    private double avgRating;
}