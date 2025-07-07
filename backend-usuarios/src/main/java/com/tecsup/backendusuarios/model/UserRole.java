package com.tecsup.backendusuarios.model;

public enum UserRole {
    ADMIN("Administrador"),
    DOCENTE("Docente"),
    ALUMNO("Alumno");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
