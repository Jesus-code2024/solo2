package com.tecsup.backendusuarios.model;

import jakarta.persistence.*;
//hello

@Entity
@Table(name = "departamentos")

public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10, unique = true)
    private String codigo;

    @Column(length = 100)
    private String nombre;    @Column(length = 100)
    private String responsable;

    public Departamento() {}

    public Departamento(Long id, String codigo, String nombre, String responsable) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.responsable = responsable;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }
}
