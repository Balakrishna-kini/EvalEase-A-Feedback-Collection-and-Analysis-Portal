package com.evalease.evalease_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormDTO {
    private Long id;
    private String title;
    private String description;
    private Instant createdAt;
    private List<QuestionDTO> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDTO {
        private Long id; // <-- Added ID for Frontend
        private String type;
        private String title;
        private boolean required;
        private List<String> options; // For multiple choice / checkbox
        private Integer ratingScale; // Used only for rating questions
    }
}