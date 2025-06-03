package com.smartappointment.auth.controller;

import com.smartappointment.auth.dto.AuthenticationRequest;
import com.smartappointment.auth.dto.RegisterRequest;
import com.smartappointment.auth.service.AuthenticationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {

        this.authenticationService = authenticationService;

    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody @Valid RegisterRequest request) {

        try {

            authenticationService.register(request);

            Map<String, String> response = new HashMap<>();

            response.put("message", "Registration successful");

            response.put("email", request.getEmail());

            response.put("name", request.getName());

            response.put("role", request.getRole()); // <-- Add this line
            
            response.put("phoneNumber", request.getPhoneNumber() != null ? request.getPhoneNumber() : "Not provided");

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, String> error = new HashMap<>();

            error.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(error);

        }

    }

   @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(
        @RequestBody @Valid AuthenticationRequest request,
        HttpSession session) {
    try {

        var user = authenticationService.authenticate(request);

        // Store user info in session
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userName", user.getFullName());
        session.setAttribute("userRole", user.getRole()); // <-- Add this line

        Map<String, String> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("email", user.getEmail());
        response.put("name", user.getFullName());
        response.put("role", user.getRole()); // <-- Add this line

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}


    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {

        session.invalidate();

        Map<String, String> response = new HashMap<>();

        response.put("message", "Logout successful");

        return ResponseEntity.ok(response);

    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {

        Map<String, String> response = new HashMap<>();

        response.put("status", "UP");

        response.put("message", "Authentication service is running");

        return ResponseEntity.ok(response);

    }
    
} 