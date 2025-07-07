package com.tecsup.backendusuarios.model;

public enum TipoAnuncio {
    GEN("General"),
    CAR("Por Carrera"),
    DEP("Por Departamento");

    private final String displayName;

    TipoAnuncio(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
