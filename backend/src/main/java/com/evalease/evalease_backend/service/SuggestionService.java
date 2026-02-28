package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.dto.TrainerSuggestionDTO;
import com.evalease.evalease_backend.entity.*;
import com.evalease.evalease_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private FormRepository formRepo;
    @Autowired
    private SubmittedFormRepository submittedFormRepo;

    // Advanced mapping for real-world trainer improvements
    private static class SuggestionRule {
        String keyword;
        String category;
        String actionableStep;
        String priority;

        SuggestionRule(String k, String c, String a, String p) {
            this.keyword = k; this.category = c; this.actionableStep = a; this.priority = p;
        }
    }

    private static final List<SuggestionRule> RULES = List.of(
        new SuggestionRule("fast", "Pacing", "Slow down delivery. Add more 'pause for questions' moments every 15 minutes.", "High"),
        new SuggestionRule("slow", "Engagement", "Increase energy. Use more interactive polls or group activities to maintain momentum.", "Medium"),
        new SuggestionRule("confusing", "Clarity", "Simplify complex jargon. Use the 'EL5' (Explain Like I'm 5) technique for core concepts.", "High"),
        new SuggestionRule("boring", "Delivery", "Incorporate real-world case studies or storytelling to make the theory relatable.", "High"),
        new SuggestionRule("practical", "Content", "Add more hands-on lab sessions. Feedback suggests users want to 'do' more than 'hear'.", "Medium"),
        new SuggestionRule("examples", "Content", "Include at least 2 more industry-specific examples per module.", "Medium"),
        new SuggestionRule("voice", "Communication", "Work on vocal variety and projection. Consider using a lapel mic if in a large room.", "Low")
    );

    public List<TrainerSuggestionDTO> getSuggestions(Long formId) {
        Form form = formRepo.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        List<SubmittedForm> submissions = submittedFormRepo.findByFormId(formId);
        List<TrainerSuggestionDTO> suggestions = new ArrayList<>();

        if (submissions.isEmpty()) return suggestions;

        Map<String, Integer> keywordCounts = new HashMap<>();
        double totalRating = 0;
        int ratingCount = 0;

        for (SubmittedForm sf : submissions) {
            for (Response r : sf.getResponses()) {
                String answer = r.getAnswer() != null ? r.getAnswer().toLowerCase() : "";
                
                // Track ratings
                if (r.getQuestion().getType().equalsIgnoreCase("rating")) {
                    try {
                        totalRating += Double.parseDouble(answer);
                        ratingCount++;
                    } catch (Exception ignored) {}
                }

                // Scan for keywords in text responses
                for (SuggestionRule rule : RULES) {
                    if (answer.contains(rule.keyword)) {
                        keywordCounts.put(rule.keyword, keywordCounts.getOrDefault(rule.keyword, 0) + 1);
                    }
                }
            }
        }

        // 1. Generate Rating-based Suggestions
        if (ratingCount > 0) {
            double avg = totalRating / ratingCount;
            if (avg < 3.5) {
                suggestions.add(TrainerSuggestionDTO.builder()
                    .category("Overall Performance")
                    .observation("Average rating is below target (" + String.format("%.2f", avg) + "/5)")
                    .actionableStep("Conduct a deep-dive review of the training curriculum and attendee prerequisites.")
                    .priority("High")
                    .build());
            } else if (avg >= 4.5) {
                suggestions.add(TrainerSuggestionDTO.builder()
                    .category("Success")
                    .observation("High attendee satisfaction (" + String.format("%.2f", avg) + "/5)")
                    .actionableStep("Document current best practices and consider mentor training roles for the lead trainer.")
                    .priority("Low")
                    .build());
            }
        }

        // 2. Generate Keyword-based Suggestions (only if keyword appears in > 10% of responses)
        double threshold = submissions.size() * 0.1;
        for (SuggestionRule rule : RULES) {
            if (keywordCounts.getOrDefault(rule.keyword, 0) > threshold) {
                suggestions.add(TrainerSuggestionDTO.builder()
                    .category(rule.category)
                    .observation("Significant feedback mentions: '" + rule.keyword + "'")
                    .actionableStep(rule.actionableStep)
                    .priority(rule.priority)
                    .build());
            }
        }

        // 3. Ensure at least one suggestion if we have submissions
        if (suggestions.isEmpty() && !submissions.isEmpty()) {
            suggestions.add(TrainerSuggestionDTO.builder()
                .category("Continuous Improvement")
                .observation("Responses are generally positive but lack specific actionable feedback.")
                .actionableStep("Incorporate more open-ended questions in future sessions to gather deeper insights.")
                .priority("Low")
                .build());
        }

        return suggestions;
    }
}
