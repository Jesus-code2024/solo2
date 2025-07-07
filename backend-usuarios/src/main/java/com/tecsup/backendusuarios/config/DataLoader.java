package com.tecsup.backendusuarios.config;

import com.tecsup.backendusuarios.model.Role;
import com.tecsup.backendusuarios.model.RoleName;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.model.AuthProvider;
import com.tecsup.backendusuarios.repository.RoleRepository;
import com.tecsup.backendusuarios.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        loadRoles();
        loadAdminUser();
    }

    private void loadRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role(RoleName.ROLE_USER);
            Role adminRole = new Role(RoleName.ROLE_ADMIN);

            roleRepository.save(userRole);
            roleRepository.save(adminRole);

            System.out.println("Roles creados exitosamente");
        }
    }

    private void loadAdminUser() {
        if (!userRepository.existsByEmail("admin@tecsup.edu.pe")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@tecsup.edu.pe");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("Tecsup");
            admin.setProvider(AuthProvider.LOCAL);
            admin.setEmailVerified(true);

            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            admin.setRoles(Collections.singleton(adminRole));

            userRepository.save(admin);
            System.out.println("Usuario admin creado exitosamente");
        }
    }
}