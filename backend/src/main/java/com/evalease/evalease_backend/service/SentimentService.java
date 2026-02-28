package com.evalease.evalease_backend.service;

import com.evalease.evalease_backend.entity.Response;
import com.evalease.evalease_backend.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.evalease.evalease_backend.dto.SentimentResult;

import java.util.*;

@Service
public class SentimentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ResponseRepository responseRepository;
    private static final String SENTIMENT_API_URL = "http://localhost:5000/analyze";

    public SentimentService(ResponseRepository responseRepository) {
        this.responseRepository = responseRepository;
    }

    @Async
    public void processResponseSentimentAsync(Long responseId) {
        try {
            Response response = responseRepository.findById(responseId).orElse(null);
            if (response == null || response.getAnswer() == null) return;

            // Only analyze text-based responses
            String type = response.getQuestion().getType();
            if (type.equalsIgnoreCase("paragraph") || type.equalsIgnoreCase("text") || type.equalsIgnoreCase("textarea")) {
                SentimentResult result = analyzeSentiment(response.getAnswer());
                response.setSentimentScore(result.getScore());
                responseRepository.save(response);
            }
        } catch (Exception e) {
            System.err.println("Async sentiment analysis failed for response " + responseId + ": " + e.getMessage());
        }
    }

    public SentimentResult analyzeSentiment(String text) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", text);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<SentimentResult> response = restTemplate.postForEntity(
                    SENTIMENT_API_URL, request, SentimentResult.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                return analyzeSentimentFallback(text);
            }
        } catch (Exception e) {
            // e.printStackTrace(); // Avoid console clutter
            return analyzeSentimentFallback(text);
        }
    }

    private SentimentResult analyzeSentimentFallback(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new SentimentResult("neutral", 0.0);
        }

        String lowerText = text.toLowerCase();
        
        // Simple keyword-based sentiment for college project reliability
        List<String> positiveWords = List.of("good", "great", "excellent", "amazing", "useful", "helpful", "clear", "well", "positive", "happy", "satisfied", "learned", "informative");
        List<String> negativeWords = List.of("bad", "poor", "confusing", "boring", "slow", "fast", "unclear", "hard", "negative", "disappointed", "dissatisfied", "waste", "long");

        int positiveCount = 0;
        int negativeCount = 0;

        for (String word : positiveWords) {
            if (lowerText.contains(word)) positiveCount++;
        }
        for (String word : negativeWords) {
            if (lowerText.contains(word)) negativeCount++;
        }

        if (positiveCount > negativeCount) {
            double score = 0.2 + (Math.min(0.8, (positiveCount - negativeCount) * 0.1));
            return new SentimentResult("positive", score);
        } else if (negativeCount > positiveCount) {
            double score = -0.2 - (Math.min(0.8, (negativeCount - positiveCount) * 0.1));
            return new SentimentResult("negative", score);
        } else {
            return new SentimentResult("neutral", 0.0);
        }
    }

    public SentimentResult analyzeSentimentBatch(List<String> texts) {
        double totalScore = 0.0;
        int positive = 0, negative = 0, neutral = 0;

        for (String text : texts) {
            SentimentResult result = analyzeSentiment(text);
            double score = result.getScore();
            totalScore += score;

            if (score > 0.1) positive++;
            else if (score < -0.1) negative++;
            else neutral++;
        }

        double avg = texts.isEmpty() ? 0.0 : totalScore / texts.size();
        String polarity = avg > 0.1 ? "positive" : (avg < -0.1 ? "negative" : "neutral");

        double positivePct = texts.isEmpty() ? 0.0 : (positive * 100.0 / texts.size());
        double negativePct = texts.isEmpty() ? 0.0 : (negative * 100.0 / texts.size());
        double neutralPct = texts.isEmpty() ? 0.0 : (neutral * 100.0 / texts.size());

        SentimentResult result = new SentimentResult(polarity, avg, positivePct, negativePct, neutralPct);
        result.setPositiveCount(positive);
        result.setNegativeCount(negative);
        result.setNeutralCount(neutral);
        return result;
    }
}
