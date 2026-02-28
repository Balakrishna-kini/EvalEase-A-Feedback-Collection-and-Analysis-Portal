package com.evalease.evalease_backend.entity;

import jakarta.persistence.*;

@Entity
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_form_id")
    private SubmittedForm submittedForm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id")
    private Form form;

    private Double sentimentScore;

    public Response() {}

    public Response(Long id, String answer, Question question, SubmittedForm submittedForm, Form form, Double sentimentScore) {
        this.id = id;
        this.answer = answer;
        this.question = question;
        this.submittedForm = submittedForm;
        this.form = form;
        this.sentimentScore = sentimentScore;
    }

    public static ResponseBuilder builder() {
        return new ResponseBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public SubmittedForm getSubmittedForm() { return submittedForm; }
    public void setSubmittedForm(SubmittedForm submittedForm) { this.submittedForm = submittedForm; }
    public Form getForm() { return form; }
    public void setForm(Form form) { this.form = form; }
    public Double getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(Double sentimentScore) { this.sentimentScore = sentimentScore; }

    public static class ResponseBuilder {
        private Long id;
        private String answer;
        private Question question;
        private SubmittedForm submittedForm;
        private Form form;
        private Double sentimentScore;

        public ResponseBuilder id(Long id) { this.id = id; return this; }
        public ResponseBuilder answer(String answer) { this.answer = answer; return this; }
        public ResponseBuilder question(Question question) { this.question = question; return this; }
        public ResponseBuilder submittedForm(SubmittedForm submittedForm) { this.submittedForm = submittedForm; return this; }
        public ResponseBuilder form(Form form) { this.form = form; return this; }
        public ResponseBuilder sentimentScore(Double sentimentScore) { this.sentimentScore = sentimentScore; return this; }
        public Response build() { return new Response(id, answer, question, submittedForm, form, sentimentScore); }
    }
}
