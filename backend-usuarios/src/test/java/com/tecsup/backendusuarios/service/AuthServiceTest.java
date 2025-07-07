package com.tecsup.backendusuarios.service;

import com.tecsup.backendusuarios.dto.auth.SignUpRequest;
import com.tecsup.backendusuarios.dto.common.ApiResponse;
import com.tecsup.backendusuarios.exception.BadRequestException;
import com.tecsup.backendusuarios.model.AuthProvider;
import com.tecsup.backendusuarios.model.Role;
import com.tecsup.backendusuarios.model.RoleName;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.repository.RoleRepository;
import com.tecsup.backendusuarios.repository.UserRepository;
import com.tecsup.backendusuarios.security.JwtTokenProvider;
import com.tecsup.backendusuarios.security.oauth2.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Role userRole;

    @BeforeEach
    void setUp() {
        userRole = new Role(RoleName.ROLE_USER);
        userRole.setId(1L);

        testUser = new User("testuser", "test@example.com", "password", "Test", "User");
        testUser.setId(1L);
        testUser.setProvider(AuthProvider.LOCAL);
    }

    @Test
    void testRegisterUser_Success() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest("newuser", "new@example.com", "password123", "New", "User");
        
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        ApiResponse response = authService.registerUser(signUpRequest);

        // Then
        assertTrue(response.getSuccess());
        assertEquals("User registered successfully", response.getMessage());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterUser_UsernameExists() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest("existinguser", "new@example.com", "password123", "New", "User");
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        BadRequestException exception = assertThrows(BadRequestException.class, 
            () -> authService.registerUser(signUpRequest));
        assertEquals("Username is already taken!", exception.getMessage());
    }

    @Test
    void testRegisterUser_EmailExists() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest("newuser", "existing@example.com", "password123", "New", "User");
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // When & Then
        BadRequestException exception = assertThrows(BadRequestException.class, 
            () -> authService.registerUser(signUpRequest));
        assertEquals("Email Address already in use!", exception.getMessage());
    }
}