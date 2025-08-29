package com.evalease.evalease_backend.dto;

import java.util.Map;

public class QuestionAnalyticsDTO {
    private String questionText;
    private String questionType;
    private String sectionName;
    private Map<String, Long> optionCounts;

    public QuestionAnalyticsDTO() {}

    public QuestionAnalyticsDTO(String questionText, String questionType, String sectionName, Map<String, Long> optionCounts) {
        this.questionText = questionText;
        this.questionType = questionType;
        this.sectionName = sectionName;
        this.optionCounts = optionCounts;
    }

    // Getters and Setters
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public Map<String, Long> getOptionCounts() { return optionCounts; }
    public void setOptionCounts(Map<String, Long> optionCounts) { this.optionCounts = optionCounts; }
}

