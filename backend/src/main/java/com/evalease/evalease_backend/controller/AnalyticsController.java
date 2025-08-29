package com.evalease.evalease_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evalease.evalease_backend.dto.QuestionAnalyticsDTO;
import com.evalease.evalease_backend.dto.SessionAnalyticsDTO;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.service.AnalyticsService;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5000")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private FormRepository formRepository;

    // 🔹 Get all training sessions
    @GetMapping("/forms")
    public List<Form> getAllForms() {
        return formRepository.findAll();
    }

    // 🔹 Get questions by session ID
    @GetMapping("/forms/{formId}/questions")
    public List<QuestionAnalyticsDTO> getQuestionAnalytics(@PathVariable Long formId) {
        return analyticsService.getQuestionAnalyticsByFormId(formId);
    }

    // 🔹 Get aggregated answers for charting
    @GetMapping("/forms/{formId}/session-analytics")
    public SessionAnalyticsDTO getSessionAnalytics(@PathVariable Long formId) {
        return analyticsService.getSessionAnalytics(formId);
    }

    // 🔹 Get average sentiment for a form
    @GetMapping("/forms/{formId}/sentiment/average")
    public Map<String, Object> getAverageSentimentByForm(@PathVariable Long formId) {
        double avg = analyticsService.getSessionAnalytics(formId).getAverageSentiment();
        Map<String, Object> result = new HashMap<>();
        result.put("averageSentiment", avg);
        result.put("category",
            avg >= 0.5 ? "Very Positive" :
            avg >= 0.2 ? "Positive" :
            avg >= -0.2 ? "Neutral" : "Negative");
        return result;
    }

    // 🔹 Get response count for a form
    @GetMapping("/forms/{formId}/responses/count")
    public Map<String, Object> getResponseCountByForm(@PathVariable Long formId) {
        long count = analyticsService.getSessionAnalytics(formId).getTotalResponses();
        Map<String, Object> result = new HashMap<>();
        result.put("responseCount", count);
        return result;
    }

    // 🔹 Get average sentiment for all forms
    @GetMapping("/forms/sentiment/average")
    public List<Map<String, Object>> getAverageSentimentAllForms() {
        List<Form> forms = formRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Form form : forms) {
            double avg = analyticsService.getSessionAnalytics(form.getId()).getAverageSentiment();
            Map<String, Object> map = new HashMap<>();
            map.put("formId", form.getId());
            map.put("name", form.getTitle());
            map.put("category",
                avg >= 0.5 ? "Very Positive" :
                avg >= 0.2 ? "Positive" :
                avg >= -0.2 ? "Neutral" : "Negative");
            map.put("averageSentiment", avg);
            result.add(map);
        }
        return result;
    }

    // 🔹 Get response count per form
    @GetMapping("/forms/responses/count")
    public List<Map<String, Object>> getResponseCountPerForm() {
        List<Form> forms = formRepository.findAll();
        List<Map<String, Object>> data = new ArrayList<>();

        for (Form form : forms) {
            long count = analyticsService.getSessionAnalytics(form.getId()).getTotalResponses();
            Map<String, Object> map = new HashMap<>();
            map.put("form", form.getTitle());
            map.put("responses", count);
            data.add(map);
        }
        return data;
    }
}
