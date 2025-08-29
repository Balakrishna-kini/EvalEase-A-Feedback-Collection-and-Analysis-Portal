package com.evalease.evalease_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class GenericResponseDTO<T> {
    private boolean success;
    private T data;
    private String error;
}
