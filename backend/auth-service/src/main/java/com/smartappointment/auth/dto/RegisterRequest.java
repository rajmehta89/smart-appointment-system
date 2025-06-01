package com.smartappointment.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank
    @Size(min = 2, max = 255)
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    @NotBlank
    @Size(min = 6, max = 50)
    private String password;
} 