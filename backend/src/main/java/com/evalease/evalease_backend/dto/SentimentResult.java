package com.evalease.evalease_backend.dto;

public class SentimentResult {
    private String polarity;
    private double score;
    private double positivePct;
    private double negativePct;
    private double neutralPct;
    private int positiveCount;
    private int negativeCount;
    private int neutralCount;

    public SentimentResult() {}

    public SentimentResult(String polarity, double score) {
        this.polarity = polarity;
        this.score = score;
    }

    public SentimentResult(String polarity, double score, double positivePct, double negativePct, double neutralPct) {
        this.polarity = polarity;
        this.score = score;
        this.positivePct = positivePct;
        this.negativePct = negativePct;
        this.neutralPct = neutralPct;
    }

    public String getPolarity() { return polarity; }
    public void setPolarity(String polarity) { this.polarity = polarity; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public double getPositivePct() { return positivePct; }
    public void setPositivePct(double positivePct) { this.positivePct = positivePct; }

    public double getNegativePct() { return negativePct; }
    public void setNegativePct(double negativePct) { this.negativePct = negativePct; }

    public double getNeutralPct() { return neutralPct; }
    public void setNeutralPct(double neutralPct) { this.neutralPct = neutralPct; }

    public int getPositiveCount() { return positiveCount; }
    public void setPositiveCount(int positiveCount) { this.positiveCount = positiveCount; }

    public int getNegativeCount() { return negativeCount; }
    public void setNegativeCount(int negativeCount) { this.negativeCount = negativeCount; }

    public int getNeutralCount() { return neutralCount; }
    public void setNeutralCount(int neutralCount) { this.neutralCount = neutralCount; }
}
