package com.evalease.evalease_backend.dto;

import java.time.LocalDateTime;

public class DashboardFormDTO {
    private Long id;
    private String title;
    private String description;
    private String createdAt;
    private LocalDateTime submittedAt;
    private java.time.Instant deadline;
    private String category;

    public DashboardFormDTO() {}

    public DashboardFormDTO(Long id, String title, String description, String createdAt, LocalDateTime submittedAt, java.time.Instant deadline, String category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.submittedAt = submittedAt;
        this.deadline = deadline;
        this.category = category;
    }

    public static DashboardFormDTOBuilder builder() {
        return new DashboardFormDTOBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public java.time.Instant getDeadline() { return deadline; }
    public void setDeadline(java.time.Instant deadline) { this.deadline = deadline; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public static class DashboardFormDTOBuilder {
        private Long id;
        private String title;
        private String description;
        private String createdAt;
        private LocalDateTime submittedAt;
        private java.time.Instant deadline;
        private String category;

        public DashboardFormDTOBuilder id(Long id) { this.id = id; return this; }
        public DashboardFormDTOBuilder title(String title) { this.title = title; return this; }
        public DashboardFormDTOBuilder description(String description) { this.description = description; return this; }
        public DashboardFormDTOBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public DashboardFormDTOBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public DashboardFormDTOBuilder deadline(java.time.Instant deadline) { this.deadline = deadline; return this; }
        public DashboardFormDTOBuilder category(String category) { this.category = category; return this; }
        public DashboardFormDTO build() { return new DashboardFormDTO(id, title, description, createdAt, submittedAt, deadline, category); }
    }
}
