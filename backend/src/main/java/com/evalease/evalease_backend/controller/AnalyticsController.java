package com.evalease.evalease_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.evalease.evalease_backend.dto.QuestionAnalyticsDTO;
import com.evalease.evalease_backend.dto.SessionAnalyticsDTO;
import com.evalease.evalease_backend.entity.Form;
import com.evalease.evalease_backend.repository.FormRepository;
import com.evalease.evalease_backend.service.AnalyticsService;

import com.evalease.evalease_backend.repository.SubmittedFormRepository;
import com.evalease.evalease_backend.entity.SubmittedForm;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private SubmittedFormRepository submittedFormRepository;

    // 🔹 Export form submissions to CSV
    @GetMapping("/forms/{formId}/export/csv")
    public void exportToCSV(@PathVariable Long formId, HttpServletResponse response) throws IOException {
        Form form = formRepository.findById(formId).orElseThrow(() -> new RuntimeException("Form not found"));
        List<SubmittedForm> submissions = submittedFormRepository.findByFormId(formId);
        
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=" + form.getTitle().replaceAll("\\s+", "_") + "_responses.csv");
        
        StringBuilder csv = new StringBuilder();
        // Header
        csv.append("Submission ID,Employee Name,Employee Email,Submitted At");
        for (var q : form.getQuestions()) {
            csv.append(",\"").append(q.getTitle().replace("\"", "\"\"")).append("\"");
        }
        csv.append("\n");
        
        // Data rows
        for (var sub : submissions) {
            csv.append(sub.getId()).append(",");
            csv.append(sub.getEmployee() != null ? sub.getEmployee().getName() : "Anonymous").append(",");
            csv.append(sub.getEmployee() != null ? sub.getEmployee().getEmail() : "N/A").append(",");
            csv.append(sub.getSubmittedAt()).append(",");
            
            // Map question ID to answer for this submission
            Map<Long, String> answersMap = new HashMap<>();
            for (var resp : sub.getResponses()) {
                answersMap.put(resp.getQuestion().getId(), resp.getAnswer());
            }
            
            for (int i = 0; i < form.getQuestions().size(); i++) {
                var q = form.getQuestions().get(i);
                String answer = answersMap.getOrDefault(q.getId(), "");
                csv.append("\"").append(answer.replace("\"", "\"\"")).append("\"");
                if (i < form.getQuestions().size() - 1) csv.append(",");
            }
            csv.append("\n");
        }
        
        response.getWriter().write(csv.toString());
    }

    // 🔹 Get submissions list for a specific form
    @GetMapping("/forms/{formId}/submissions")
    public List<Map<String, Object>> getFormSubmissions(@PathVariable Long formId) {
        List<SubmittedForm> submissions = submittedFormRepository.findByFormId(formId);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (SubmittedForm sub : submissions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sub.getId());
            map.put("submittedAt", sub.getSubmittedAt());
            if (sub.getEmployee() != null) {
                map.put("employeeName", sub.getEmployee().getName());
                map.put("employeeEmail", sub.getEmployee().getEmail());
            } else {
                map.put("employeeName", "Anonymous");
                map.put("employeeEmail", "N/A");
            }
            result.add(map);
        }
        return result;
    }

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
                SessionAnalyticsDTO analytics = analyticsService.getSessionAnalytics(form.getId());
                double avg = analytics.getAverageSentiment();
                map.put("averageSentiment", avg);
                map.put("category",
                    avg > 0.1 ? "Positive" :
                    avg < -0.1 ? "Negative" : "Neutral");
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
            // Use optimized count query instead of full analytics load
            long count = submittedFormRepository.countByFormId(form.getId());
            map.put("responses", count); 
            data.add(map);
        }
        return data;
    }

    // 🔹 Get system-wide top performers
    @GetMapping("/summary/top-performers")
    public Map<String, Object> getTopPerformers() {
        List<Form> forms = formRepository.findAll();
        long totalResponses = submittedFormRepository.count();
        
        Map<String, Object> result = new HashMap<>();
        
        Form topRatedForm = null;
        double maxRating = -1.0;
        
        Form topSentimentForm = null;
        double maxSentiment = -2.0;

        for (Form form : forms) {
            try {
                SessionAnalyticsDTO analytics = analyticsService.getSessionAnalytics(form.getId());
                
                if (analytics.getAverageRating() > maxRating) {
                    maxRating = analytics.getAverageRating();
                    topRatedForm = form;
                }
                
                double sentimentScore = analytics.getAverageSentiment();
                if (sentimentScore > maxSentiment) {
                    maxSentiment = sentimentScore;
                    topSentimentForm = form;
                }
            } catch (Exception ignored) {}
        }

        result.put("topRatedForm", topRatedForm != null ? topRatedForm.getTitle() : "N/A");
        result.put("topRating", topRatedForm != null ? maxRating : 0.0);
        result.put("topSentimentForm", topSentimentForm != null ? topSentimentForm.getTitle() : "N/A");
        result.put("topSentiment", topSentimentForm != null ? maxSentiment : 0.0);
        
        result.put("totalForms", forms.size());
        result.put("totalResponses", totalResponses);
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
            map.put("deadline", f.getDeadline());
            map.put("category", f.getCategory());
            result.add(map);
        }
        return result;
    }
}
