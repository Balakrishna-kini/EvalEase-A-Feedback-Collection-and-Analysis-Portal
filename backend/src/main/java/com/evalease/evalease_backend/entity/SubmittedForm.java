package com.evalease.evalease_backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class SubmittedForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "form_id")
    @JsonBackReference
    private Form form;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "submittedForm", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Response> responses;

    public SubmittedForm() {}

    public SubmittedForm(Long id, Form form, Employee employee, LocalDateTime submittedAt, List<Response> responses) {
        this.id = id;
        this.form = form;
        this.employee = employee;
        this.submittedAt = submittedAt;
        this.responses = responses;
    }

    public static SubmittedFormBuilder builder() {
        return new SubmittedFormBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Form getForm() { return form; }
    public void setForm(Form form) { this.form = form; }
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public List<Response> getResponses() { return responses; }
    public void setResponses(List<Response> responses) { this.responses = responses; }

    public static class SubmittedFormBuilder {
        private Long id;
        private Form form;
        private Employee employee;
        private LocalDateTime submittedAt;
        private List<Response> responses;

        public SubmittedFormBuilder id(Long id) { this.id = id; return this; }
        public SubmittedFormBuilder form(Form form) { this.form = form; return this; }
        public SubmittedFormBuilder employee(Employee employee) { this.employee = employee; return this; }
        public SubmittedFormBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }
        public SubmittedFormBuilder responses(List<Response> responses) { this.responses = responses; return this; }
        public SubmittedForm build() { return new SubmittedForm(id, form, employee, submittedAt, responses); }
    }
}
