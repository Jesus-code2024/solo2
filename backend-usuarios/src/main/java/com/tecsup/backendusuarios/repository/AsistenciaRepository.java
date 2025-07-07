package com.tecsup.backendusuarios.repository;

import com.tecsup.backendusuarios.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    long countByEventoIdAndTipo(Long eventoId, String tipo);
    boolean existsByEventoIdAndUserIdAndTipo(Long eventoId, Long userId, String tipo);
}
