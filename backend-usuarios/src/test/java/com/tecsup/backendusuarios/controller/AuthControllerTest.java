package com.tecsup.backendusuarios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecsup.backendusuarios.dto.auth.JwtAuthenticationResponse;
import com.tecsup.backendusuarios.dto.auth.LoginRequest;
import com.tecsup.backendusuarios.dto.auth.SignUpRequest;
import com.tecsup.backendusuarios.dto.auth.UserInfo;
import com.tecsup.backendusuarios.dto.common.ApiResponse;
import com.tecsup.backendusuarios.security.oauth2.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void testSignIn_Success() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        UserInfo userInfo = new UserInfo(1L, "testuser", "test@example.com", "Test", "User", null, Arrays.asList("ROLE_USER"));
        JwtAuthenticationResponse response = new JwtAuthenticationResponse("jwt-token", userInfo);

        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/auth/signin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    @WithMockUser
    void testSignUp_Success() throws Exception {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest("newuser", "new@example.com", "password123", "New", "User");
        ApiResponse apiResponse = new ApiResponse(true, "User registered successfully");

        when(authService.registerUser(any(SignUpRequest.class))).thenReturn(apiResponse);

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    @WithMockUser
    void testSignUp_InvalidData() throws Exception {
        // Given - SignUpRequest with invalid data (empty fields)
        SignUpRequest signUpRequest = new SignUpRequest("", "", "", "", "");

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isBadRequest());
    }
}