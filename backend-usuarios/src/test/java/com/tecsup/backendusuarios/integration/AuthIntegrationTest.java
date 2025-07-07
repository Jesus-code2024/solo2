package com.tecsup.backendusuarios.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecsup.backendusuarios.dto.auth.LoginRequest;
import com.tecsup.backendusuarios.dto.auth.SignUpRequest;
import com.tecsup.backendusuarios.model.Role;
import com.tecsup.backendusuarios.model.RoleName;
import com.tecsup.backendusuarios.repository.RoleRepository;
import com.tecsup.backendusuarios.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Ensure roles exist
        if (roleRepository.findByName(RoleName.ROLE_USER).isEmpty()) {
            roleRepository.save(new Role(RoleName.ROLE_USER));
        }
        if (roleRepository.findByName(RoleName.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(RoleName.ROLE_ADMIN));
        }
    }

    @Test
    void testFullAuthFlow_SignUpAndSignIn() throws Exception {
        // Step 1: Sign up a new user
        SignUpRequest signUpRequest = new SignUpRequest(
            "integrationtest", 
            "integration@test.com", 
            "password123", 
            "Integration", 
            "Test"
        );

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Step 2: Sign in with the created user
        LoginRequest loginRequest = new LoginRequest("integration@test.com", "password123");

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.email").value("integration@test.com"))
                .andExpect(jsonPath("$.user.username").value("integrationtest"));
    }

    @Test
    void testSignUp_DuplicateEmail() throws Exception {
        // Step 1: Create first user
        SignUpRequest firstUser = new SignUpRequest(
            "user1", 
            "duplicate@test.com", 
            "password123", 
            "First", 
            "User"
        );

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstUser)))
                .andExpect(status().isOk());

        // Step 2: Try to create user with same email
        SignUpRequest secondUser = new SignUpRequest(
            "user2", 
            "duplicate@test.com", 
            "password456", 
            "Second", 
            "User"
        );

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(secondUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email Address already in use!"));
    }
}