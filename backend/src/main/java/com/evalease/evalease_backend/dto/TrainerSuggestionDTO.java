package com.evalease.evalease_backend.dto;

public class TrainerSuggestionDTO {
    private String category;
    private String observation;
    private String actionableStep;
    private String priority;

    public TrainerSuggestionDTO() {}

    public TrainerSuggestionDTO(String category, String observation, String actionableStep, String priority) {
        this.category = category;
        this.observation = observation;
        this.actionableStep = actionableStep;
        this.priority = priority;
    }

    public static TrainerSuggestionDTOBuilder builder() {
        return new TrainerSuggestionDTOBuilder();
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
    public String getActionableStep() { return actionableStep; }
    public void setActionableStep(String actionableStep) { this.actionableStep = actionableStep; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public static class TrainerSuggestionDTOBuilder {
        private String category;
        private String observation;
        private String actionableStep;
        private String priority;

        public TrainerSuggestionDTOBuilder category(String category) { this.category = category; return this; }
        public TrainerSuggestionDTOBuilder observation(String observation) { this.observation = observation; return this; }
        public TrainerSuggestionDTOBuilder actionableStep(String actionableStep) { this.actionableStep = actionableStep; return this; }
        public TrainerSuggestionDTOBuilder priority(String priority) { this.priority = priority; return this; }
        public TrainerSuggestionDTO build() { return new TrainerSuggestionDTO(category, observation, actionableStep, priority); }
    }
}
