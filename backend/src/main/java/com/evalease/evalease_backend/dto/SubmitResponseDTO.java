package com.evalease.evalease_backend.dto;

import java.util.Map;

public class SubmitResponseDTO {
    private Long formId;
    private Long employeeId;
    private Map<String, Object> responses;

    public SubmitResponseDTO() {}

    public SubmitResponseDTO(Long formId, Long employeeId, Map<String, Object> responses) {
        this.formId = formId;
        this.employeeId = employeeId;
        this.responses = responses;
    }

    public Long getFormId() { return formId; }
    public void setFormId(Long formId) { this.formId = formId; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public Map<String, Object> getResponses() { return responses; }
    public void setResponses(Map<String, Object> responses) { this.responses = responses; }
}
