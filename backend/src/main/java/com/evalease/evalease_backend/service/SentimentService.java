package com.evalease.evalease_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.evalease.evalease_backend.dto.SentimentResult;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SentimentService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SENTIMENT_API_URL = "http://localhost:5000/analyze";

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
                return new SentimentResult("neutral", 0.0);
            }
        } catch (Exception e) {
            e.printStackTrace();
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
