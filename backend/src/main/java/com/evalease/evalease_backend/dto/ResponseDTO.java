package com.evalease.evalease_backend.dto;

import lombok.Data;

@Data
public class ResponseDTO {
    private Long questionId;
    private String answer;

    // You can add constructors if needed
    // Or use @AllArgsConstructor, @NoArgsConstructor annotations
}