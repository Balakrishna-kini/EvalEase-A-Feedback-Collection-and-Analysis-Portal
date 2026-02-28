package com.evalease.evalease_backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SubmittedForm> submittedForms;

    public Employee() {}

    public Employee(Long id, String name, String email, String password, Role role, List<SubmittedForm> submittedForms) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.submittedForms = submittedForms;
    }

    public static EmployeeBuilder builder() {
        return new EmployeeBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public List<SubmittedForm> getSubmittedForms() { return submittedForms; }
    public void setSubmittedForms(List<SubmittedForm> submittedForms) { this.submittedForms = submittedForms; }

    public static class EmployeeBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private List<SubmittedForm> submittedForms;

        public EmployeeBuilder id(Long id) { this.id = id; return this; }
        public EmployeeBuilder name(String name) { this.name = name; return this; }
        public EmployeeBuilder email(String email) { this.email = email; return this; }
        public EmployeeBuilder password(String password) { this.password = password; return this; }
        public EmployeeBuilder role(Role role) { this.role = role; return this; }
        public EmployeeBuilder submittedForms(List<SubmittedForm> submittedForms) { this.submittedForms = submittedForms; return this; }
        public Employee build() { return new Employee(id, name, email, password, role, submittedForms); }
    }
}
