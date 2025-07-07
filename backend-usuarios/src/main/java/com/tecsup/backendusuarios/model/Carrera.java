package com.tecsup.backendusuarios.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carreras")
public class Carrera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10, unique = true)
    private String codigo;

    @Column(length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // AÑADE ESTA LÍNEA PARA EL CAMPO IMAGEN
    private String imagen;

    public Carrera() {}

    // MODIFICA EL CONSTRUCTOR EXISTENTE PARA INCLUIR 'imagen'
    public Carrera(Long id, String codigo, String nombre, String descripcion, String imagen) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen; // <--- AÑADIDO
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // AÑADE ESTOS GETTER Y SETTER PARA EL CAMPO IMAGEN
    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    // Opcional: Si tienes un método toString(), también deberías incluir 'imagen' allí
    @Override
    public String toString() {
        return "Carrera{" +
                "id=" + id +
                ", codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", imagen='" + imagen + '\'' + // <-- Opcional, para logs/debug
                '}';
    }
}