package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.dto.DashboardFormDTO;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.entity.SubmittedForm;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.repository.EmployeeFormStatusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeDashboardService {

    @Autowired
    private EmployeeFormStatusRepository employeeFormStatusRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Map<String, List<DashboardFormDTO>> getFormsForEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        List<Form> allForms = formRepository.findAll();
        List<SubmittedForm> submittedFormsByEmployee = employeeFormStatusRepository.findByEmployee(employee);

        Map<Long, LocalDateTime> submittedFormTimestamps = submittedFormsByEmployee.stream()
                .collect(Collectors.toMap(
                        sf -> sf.getForm().getId(),
                        SubmittedForm::getSubmittedAt
                ));

        List<DashboardFormDTO> pendingForms = allForms.stream()
                .filter(form -> !submittedFormTimestamps.containsKey(form.getId()))
                .map(form -> DashboardFormDTO.builder()
                        .id(form.getId())
                        .title(form.getTitle())
                        .description(form.getDescription())
                        .createdAt(form.getCreatedAt().toString())
                        .submittedAt(null)
                        .deadline(form.getDeadline())
                        .category(form.getCategory())
                        .build())
                .collect(Collectors.toList());

        List<DashboardFormDTO> completedForms = allForms.stream()
                .filter(form -> submittedFormTimestamps.containsKey(form.getId()))
                .map(form -> DashboardFormDTO.builder()
                        .id(form.getId())
                        .title(form.getTitle())
                        .description(form.getDescription())
                        .createdAt(form.getCreatedAt().toString())
                        .submittedAt(submittedFormTimestamps.get(form.getId()))
                        .deadline(form.getDeadline())
                        .category(form.getCategory())
                        .build())
                .collect(Collectors.toList());

        return Map.of(
                "pendingForms", pendingForms,
                "completedForms", completedForms
        );
    }

    public List<Map<String, Object>> getEmployeeFeedbackHistory(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        List<SubmittedForm> submissions = employeeFormStatusRepository.findByEmployee(employee);
        
        return submissions.stream().map(sf -> {
            Map<String, Object> details = new HashMap<>();
            details.put("submissionId", sf.getId());
            details.put("formTitle", sf.getForm().getTitle());
            details.put("submittedAt", sf.getSubmittedAt());
            
            List<Map<String, Object>> responseDetails = sf.getResponses().stream().map(r -> {
                Map<String, Object> resp = new HashMap<>();
                resp.put("question", r.getQuestion().getTitle());
                resp.put("answer", r.getAnswer());
                resp.put("sentiment", r.getSentimentScore());
                return resp;
            }).collect(Collectors.toList());
            
            details.put("responses", responseDetails);
            return details;
        }).collect(Collectors.toList());
    }
}
