package com.evalease.evalease_backend.dto;

import com.evalease.evalease_backend.entity.Role;

public class AuthenticationResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private Role role;

    public AuthenticationResponse() {}

    public AuthenticationResponse(String token, Long id, String name, String email, Role role) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static AuthenticationResponseBuilder builder() {
        return new AuthenticationResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static class AuthenticationResponseBuilder {
        private String token;
        private Long id;
        private String name;
        private String email;
        private Role role;

        public AuthenticationResponseBuilder token(String token) { this.token = token; return this; }
        public AuthenticationResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthenticationResponseBuilder name(String name) { this.name = name; return this; }
        public AuthenticationResponseBuilder email(String email) { this.email = email; return this; }
        public AuthenticationResponseBuilder role(Role role) { this.role = role; return this; }
        public AuthenticationResponse build() { return new AuthenticationResponse(token, id, name, email, role); }
    }
}
