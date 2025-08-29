package com.evalease.evalease_backend.dto;

public class TrainerSuggestionDTO {
    private String question;
    private String reason;
    private String suggestion;

    public TrainerSuggestionDTO(String question, String reason, String suggestion) {
        this.question = question;
        this.reason = reason;
        this.suggestion = suggestion;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
}
