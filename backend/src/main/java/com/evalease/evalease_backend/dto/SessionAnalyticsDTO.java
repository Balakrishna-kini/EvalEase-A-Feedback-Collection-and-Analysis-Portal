package com.evalease.evalease_backend.dto;

import java.util.List;

public class SessionAnalyticsDTO {
    private Long formId;
    private int totalResponses;
    private int questionCount;
    private double averageRating;
    private SentimentResult sentiment;
    private List<QuestionAnalyticsDTO> questions;

    // Default constructor
    public SessionAnalyticsDTO() {
    }

    // Getters and Setters
    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public int getTotalResponses() {
        return totalResponses;
    }

    public void setTotalResponses(int totalResponses) {
        this.totalResponses = totalResponses;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public SentimentResult getSentiment() {
        return sentiment;
    }

    public void setSentiment(SentimentResult sentiment) {
        this.sentiment = sentiment;
    }

    public List<QuestionAnalyticsDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionAnalyticsDTO> questions) {
        this.questions = questions;
    }

    public double getAverageSentiment() {
    return sentiment != null ? sentiment.getScore() : 0.0;
    }



}