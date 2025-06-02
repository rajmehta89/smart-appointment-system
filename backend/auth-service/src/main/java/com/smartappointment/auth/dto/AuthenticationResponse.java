package com.smartappointment.auth.dto;

public class AuthenticationResponse {

    private String token;

    private String email;

    private String fullName;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, String email, String fullName) {

        this.token = token;

        this.email = email;

        this.fullName = fullName;

    }

    public String getToken() {

        return token;

    }

    public void setToken(String token) {

        this.token = token;

    }

    public String getEmail() {

        return email;

    }

    public void setEmail(String email) {

        this.email = email;

    }

    public String getFullName() {

        return fullName;

    }

    public void setFullName(String fullName) {

        this.fullName = fullName;

    }

    public static AuthenticationResponseBuilder builder() {

        return new AuthenticationResponseBuilder();

    }

    public static class AuthenticationResponseBuilder {

        private String token;

        private String email;

        private String fullName;

        AuthenticationResponseBuilder() {
            
        }

        public AuthenticationResponseBuilder token(String token) {

            this.token = token;

            return this;

        }

        public AuthenticationResponseBuilder email(String email) {

            this.email = email;

            return this;


        }

        public AuthenticationResponseBuilder fullName(String fullName) {

            this.fullName = fullName;

            return this;

        }

        public AuthenticationResponse build() {

            return new AuthenticationResponse(token, email, fullName);

        }

    }
} 