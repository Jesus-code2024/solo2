package com.tecsup.backendusuarios.repository;

import com.tecsup.backendusuarios.model.Webinar;
import com.tecsup.backendusuarios.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Long> {
    List<Webinar> findByAutor(User autor);
    List<Webinar> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Webinar> findByExpositor(String expositor);

    // **********************************************
    // Nuevo método para encontrar webinars destacados
    List<Webinar> findByDestacadoTrue();
    // Opcional: para ordenar por fecha, por si quieres los más recientes destacados
    List<Webinar> findByDestacadoTrueOrderByFechaDesc();
    // **********************************************
}