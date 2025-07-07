package com.tecsup.backendusuarios.repository;

import com.tecsup.backendusuarios.model.Role;
import com.tecsup.backendusuarios.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}