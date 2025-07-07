package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.dto.auth.JwtAuthenticationResponse;
import com.tecsup.backendusuarios.dto.auth.LoginRequest;
import com.tecsup.backendusuarios.dto.auth.SignUpRequest;
import com.tecsup.backendusuarios.dto.common.ApiResponse;
import com.tecsup.backendusuarios.security.oauth2.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        ApiResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }
}