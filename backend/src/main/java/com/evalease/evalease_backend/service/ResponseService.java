package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.entity.*;
import com.evalease.evalease_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ResponseService {

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private SubmittedFormRepository submittedFormRepository;

    public void saveResponses(Long formId, Long employeeId, Map<Long, Object> responsesMap) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        SubmittedForm submittedForm = SubmittedForm.builder()
                .form(form)
                .employee(employee)
                .submittedAt(LocalDateTime.now())
                .build();

        List<Response> responses = new ArrayList<>();

        for (Map.Entry<Long, Object> entry : responsesMap.entrySet()) {
            Long questionId = entry.getKey();
            Object answerObj = entry.getValue();

            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            String answerString = answerObj instanceof List ? String.join(",", (List<String>) answerObj) : answerObj.toString();

            Response response = Response.builder()
                    .question(question)
                    .answer(answerString)
                    .submittedForm(submittedForm)
                    .build();

            responses.add(response);
        }

        submittedForm.setResponses(responses);

        submittedFormRepository.save(submittedForm);
    }
}
