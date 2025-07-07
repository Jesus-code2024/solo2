package com.tecsup.backendusuarios.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "webinars")
public class Webinar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200, nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDateTime fecha; // Ya tienes 'fecha'

    @Column(nullable = false)
    private String enlace;

    @Column(length = 100)
    private String expositor;

    private String imagen;

    // **********************************************
    // ¡NUEVO CAMPO!
    @Column(nullable = false)
    private boolean destacado;
    // **********************************************

    @ManyToOne
    @JoinColumn(name = "autor_id", nullable = false)
    private User autor;

    public Webinar() {}

    // Tu constructor existente. Asegúrate de actualizarlo si lo usas con `destacado`.
    // Si no lo usas, puedes dejarlo como está o actualizarlo para incluir `destacado`.
    // public Webinar(Long id, String titulo, String descripcion, LocalDateTime fecha, String enlace, String expositor, String imagen, User autor) {
    //     this.id = id;
    //     this.titulo = titulo;
    //     this.descripcion = descripcion;
    //     this.fecha = fecha;
    //     this.enlace = enlace;
    //     this.expositor = expositor;
    //     this.imagen = imagen;
    //     this.autor = autor;
    // }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }

    public String getExpositor() {
        return expositor;
    }

    public void setExpositor(String expositor) {
        this.expositor = expositor;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    // **********************************************
    // Getter y Setter para el nuevo campo 'destacado'
    public boolean isDestacado() {
        return destacado;
    }

    public void setDestacado(boolean destacado) {
        this.destacado = destacado;
    }
    // **********************************************

    public User getAutor() {
        return autor;
    }

    public void setAutor(User autor) {
        this.autor = autor;
    }
}