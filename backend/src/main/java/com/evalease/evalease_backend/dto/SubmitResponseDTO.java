package com.evalease.evalease_backend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SubmitResponseDTO {
    private Long formId;
    private Long employeeId;
    private Map<String, Object> responses; // <--- Keep keys as String
}
