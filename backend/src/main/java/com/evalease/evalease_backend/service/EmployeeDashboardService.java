package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.dto.DashboardFormDTO;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.entity.SubmittedForm;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.repository.EmployeeFormStatusRepository; // Renamed repository

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Keep for potential future use, or remove if not needed elsewhere

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmployeeDashboardService { // Renamed service

    @Autowired
    private EmployeeFormStatusRepository employeeFormStatusRepository; // Renamed repository field

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // Removed @Autowired private QuestionRepository questionRepository; as it's not needed for just fetching dashboard forms

    /**
     * Retrieves and categorizes all available forms for a specific employee
     * into two lists: pending forms (not yet submitted) and completed forms (already submitted).
     * This method now returns DashboardFormDTOs.
     *
     * @param employeeId The ID of the employee for whom to categorize forms.
     * @return A Map where keys are "pendingForms" and "completedForms",
     * and values are Lists of DashboardFormDTOs.
     */
    public Map<String, List<DashboardFormDTO>> getFormsForEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + employeeId));

        List<Form> allForms = formRepository.findAll();
        List<SubmittedForm> submittedFormsByEmployee = employeeFormStatusRepository.findByEmployee(employee); // Use renamed repository

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
                        .build())
                .collect(Collectors.toList());

        return Map.of(
                "pendingForms", pendingForms,
                "completedForms", completedForms
        );
    }
}