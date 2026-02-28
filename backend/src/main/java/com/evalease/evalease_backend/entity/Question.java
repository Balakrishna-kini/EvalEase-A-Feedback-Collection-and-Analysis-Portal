package com.evalease.evalease_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type; // e.g., "rating", "multiple", "text"
    private boolean required;
    private Integer ratingScale; // For rating questions

    @ManyToOne
    @JoinColumn(name = "form_id")
    @JsonBackReference
    private Form form;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OptionItem> options;

    public Question() {}

    public Question(Long id, String title, String type, boolean required, Integer ratingScale, Form form, List<OptionItem> options) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.required = required;
        this.ratingScale = ratingScale;
        this.form = form;
        this.options = options;
    }

    public static QuestionBuilder builder() {
        return new QuestionBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
    public Integer getRatingScale() { return ratingScale; }
    public void setRatingScale(Integer ratingScale) { this.ratingScale = ratingScale; }
    public Form getForm() { return form; }
    public void setForm(Form form) { this.form = form; }
    public List<OptionItem> getOptions() { return options; }
    public void setOptions(List<OptionItem> options) { this.options = options; }

    public static class QuestionBuilder {
        private Long id;
        private String title;
        private String type;
        private boolean required;
        private Integer ratingScale;
        private Form form;
        private List<OptionItem> options;

        public QuestionBuilder id(Long id) { this.id = id; return this; }
        public QuestionBuilder title(String title) { this.title = title; return this; }
        public QuestionBuilder type(String type) { this.type = type; return this; }
        public QuestionBuilder required(boolean required) { this.required = required; return this; }
        public QuestionBuilder ratingScale(Integer ratingScale) { this.ratingScale = ratingScale; return this; }
        public QuestionBuilder form(Form form) { this.form = form; return this; }
        public QuestionBuilder options(List<OptionItem> options) { this.options = options; return this; }
        public Question build() { return new Question(id, title, type, required, ratingScale, form, options); }
    }
}
