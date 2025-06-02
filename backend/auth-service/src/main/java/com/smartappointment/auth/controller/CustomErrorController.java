package com.smartappointment.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {

        Map<String, Object> errorDetails = new HashMap<>();

        HttpStatus status = getStatus(request);
        
        errorDetails.put("status", status.value());

        errorDetails.put("error", status.getReasonPhrase());

        errorDetails.put("path", request.getRequestURI());
        
        if (status == HttpStatus.FORBIDDEN) {

            errorDetails.put("message", "Access Denied: You don't have permission to access this resource");

        } else {

            errorDetails.put("message", "An error occurred processing your request");

        }

        return new ResponseEntity<>(errorDetails, status);
        
    }

    private HttpStatus getStatus(HttpServletRequest request) {

        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");

        if (statusCode == null) {
            
            return HttpStatus.INTERNAL_SERVER_ERROR;

        }

        try {

            return HttpStatus.valueOf(statusCode);

        } catch (Exception ex) {

            return HttpStatus.INTERNAL_SERVER_ERROR;

        }

    }
} 