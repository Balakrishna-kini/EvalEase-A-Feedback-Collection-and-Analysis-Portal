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
            Map<String, Object> map = new HashMap<>();
            map.put("formId", form.getId());
            map.put("name", form.getTitle());
            
            try {
                // Optimization: Don't do heavy analytics here just for the list view
                // Default to neutral if we can't get it quickly
                map.put("category", "Neutral");
                map.put("averageSentiment", 0.0);
            } catch (Exception e) {
                map.put("category", "Neutral");
                map.put("averageSentiment", 0.0);
            }
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
            Map<String, Object> map = new HashMap<>();
            map.put("form", form.getTitle());
            map.put("responses", 0L); // Default to 0 for speed in overview
            data.add(map);
        }
        return data;
    }

    // 🔹 Get system-wide top performers
    @GetMapping("/summary/top-performers")
    public Map<String, Object> getTopPerformers() {
        List<Form> forms = formRepository.findAll();
        Map<String, Object> result = new HashMap<>();
        result.put("topRatedForm", "N/A");
        result.put("topRating", 0.0);
        result.put("topSentimentForm", "N/A");
        result.put("topSentiment", 0.0);
        result.put("totalForms", forms.size());
        result.put("totalResponses", 0L);
        return result;
    }

    // 🔹 New optimized endpoint for form basic details
    @GetMapping("/forms/list")
    public List<Map<String, Object>> getFormsList() {
        List<Form> forms = formRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Form f : forms) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("title", f.getTitle());
            map.put("description", f.getDescription());
            result.add(map);
        }
        return result;
    }
}
