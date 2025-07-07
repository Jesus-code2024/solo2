package com.tecsup.backendusuarios.service;

import com.tecsup.backendusuarios.model.Asistencia;
import com.tecsup.backendusuarios.repository.AsistenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AsistenciaService {
    @Autowired
    private AsistenciaRepository repo;

    public Asistencia registrarAsistencia(Long userId, Long eventoId, String tipo) {
        if (repo.existsByEventoIdAndUserIdAndTipo(eventoId, userId, tipo)) {
            throw new RuntimeException("Ya registrado");
        }
        Asistencia a = new Asistencia();
        a.setUserId(userId);
        a.setEventoId(eventoId);
        a.setTipo(tipo);
        a.setFechaRegistro(LocalDateTime.now());
        return repo.save(a);
    }

    public long contarAsistentes(Long eventoId, String tipo) {
        return repo.countByEventoIdAndTipo(eventoId, tipo);
    }

    public boolean yaAsistio(Long eventoId, Long userId, String tipo) {
        return repo.existsByEventoIdAndUserIdAndTipo(eventoId, userId, tipo);
    }
}
