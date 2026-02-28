package com.evalease.evalease_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class OptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    @JsonBackReference
    private Question question;

    public OptionItem() {}

    public OptionItem(Long id, String value, Question question) {
        this.id = id;
        this.value = value;
        this.question = question;
    }

    public static OptionItemBuilder builder() {
        return new OptionItemBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public static class OptionItemBuilder {
        private Long id;
        private String value;
        private Question question;

        public OptionItemBuilder id(Long id) { this.id = id; return this; }
        public OptionItemBuilder value(String value) { this.value = value; return this; }
        public OptionItemBuilder question(Question question) { this.question = question; return this; }
        public OptionItem build() { return new OptionItem(id, value, question); }
    }
}
