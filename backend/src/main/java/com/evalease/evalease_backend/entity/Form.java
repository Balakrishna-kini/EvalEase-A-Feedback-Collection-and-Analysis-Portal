package com.evalease.evalease_backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;
import java.time.Instant;

@Entity
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String title;

    private String description;
    private Instant createdAt;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Response> responses;

    public Form() {}

    public Form(Long id, String title, String description, Instant createdAt, List<Question> questions, List<Response> responses) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.questions = questions;
        this.responses = responses;
    }

    public static FormBuilder builder() {
        return new FormBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    public List<Response> getResponses() { return responses; }
    public void setResponses(List<Response> responses) { this.responses = responses; }

    public static class FormBuilder {
        private Long id;
        private String title;
        private String description;
        private Instant createdAt;
        private List<Question> questions;
        private List<Response> responses;

        public FormBuilder id(Long id) { this.id = id; return this; }
        public FormBuilder title(String title) { this.title = title; return this; }
        public FormBuilder description(String description) { this.description = description; return this; }
        public FormBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public FormBuilder questions(List<Question> questions) { this.questions = questions; return this; }
        public FormBuilder responses(List<Response> responses) { this.responses = responses; return this; }
        public Form build() { return new Form(id, title, description, createdAt, questions, responses); }
    }
}
