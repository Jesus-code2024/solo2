package com.tecsup.backendusuarios.repository;

import com.tecsup.backendusuarios.model.Evento;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.model.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByAutor(User autor);
    List<Evento> findByCarrera(Carrera carrera);
    List<Evento> findByFechaInicioBetween(LocalDateTime inicio, LocalDateTime fin);

    // **********************************************
    // Nuevo método para encontrar eventos destacados
    List<Evento> findByDestacadoTrue();
    // Opcional: para ordenar por fecha de inicio, por si quieres los más recientes destacados
    List<Evento> findByDestacadoTrueOrderByFechaInicioDesc();
    // **********************************************
}