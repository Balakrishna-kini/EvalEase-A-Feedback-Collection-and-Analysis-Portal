package com.evalease.evalease_backend.dto;

public class AdminDashboardStatsDTO {
    private int totalForms;
    private int responses;
    private double avgRating;

    public AdminDashboardStatsDTO() {}

    public AdminDashboardStatsDTO(int totalForms, int responses, double avgRating) {
        this.totalForms = totalForms;
        this.responses = responses;
        this.avgRating = avgRating;
    }

    public int getTotalForms() { return totalForms; }
    public void setTotalForms(int totalForms) { this.totalForms = totalForms; }
    public int getResponses() { return responses; }
    public void setResponses(int responses) { this.responses = responses; }
    public double getAvgRating() { return avgRating; }
    public void setAvgRating(double avgRating) { this.avgRating = avgRating; }
}
