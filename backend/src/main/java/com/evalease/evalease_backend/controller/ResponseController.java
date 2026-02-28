package com.evalease.evalease_backend.controller;

import com.evalease.evalease_backend.dto.SubmitResponseDTO;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.entity.Question;
import com.evalease.evalease_backend.entity.Response;
import com.evalease.evalease_backend.entity.SubmittedForm;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.repository.QuestionRepository;
import com.evalease.evalease_backend.repository.ResponseRepository;
import com.evalease.evalease_backend.repository.SubmittedFormRepository;
import com.evalease.evalease_backend.service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:8081")
public class ResponseController {

        @Autowired
        private FormRepository formRepository;

        @Autowired
        private QuestionRepository questionRepository;

        @Autowired
        private EmployeeRepository employeeRepository;

        @Autowired
        private SubmittedFormRepository submittedFormRepository;

        @Autowired
        private ResponseRepository responseRepository;

        @Autowired
        private SentimentService sentimentService;

        @PostMapping
        public ResponseEntity<String> submitResponses(@RequestBody SubmitResponseDTO payload) {
                Long formId = payload.getFormId();
                Long employeeId = payload.getEmployeeId();

                // Change responsesMap to Map<String, Object>
                Map<String, Object> responsesMap = payload.getResponses();

                System.out.println("responsesMap = " + responsesMap);

                // Fetch Form & Employee
                Form form = formRepository.findById(formId)
                                .orElseThrow(() -> new RuntimeException("Form not found with id: " + formId));
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

                // Save SubmittedForm
                SubmittedForm submittedForm = SubmittedForm.builder()
                                .form(form)
                                .employee(employee)
                                .submittedAt(LocalDateTime.now())
                                .build();

                SubmittedForm savedSubmittedForm = submittedFormRepository.save(submittedForm);

                // Process Responses
                List<Response> responses = new ArrayList<>();
                for (Map.Entry<String, Object> entry : responsesMap.entrySet()) {
                        Long questionId = Long.parseLong(entry.getKey()); // Parse key to Long
                        String answerValue = entry.getValue().toString();

                        Question question = questionRepository.findById(questionId)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Question not found with id: " + questionId));

                        Response response = Response.builder()
                                        .question(question)
                                        .answer(answerValue)
                                        .submittedForm(savedSubmittedForm)
                                        .form(form)
                                        .build();

                        responses.add(response);
                }

                // Save All Responses
                List<Response> savedResponses = responseRepository.saveAll(responses);

                // Trigger Async Sentiment Analysis for each text response
                for (Response resp : savedResponses) {
                    sentimentService.processResponseSentimentAsync(resp.getId());
                }

                return ResponseEntity.ok("Responses saved successfully!");
        }

}
