package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.dto.AsistenciaDTO;
import com.tecsup.backendusuarios.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {
    @Autowired
    private AsistenciaService service;

    @PostMapping
    public void asistir(@RequestBody AsistenciaDTO dto) {
        service.registrarAsistencia(dto.getUserId(), dto.getEventoId(), dto.getTipo());
    }

    @GetMapping("/evento/{eventoId}/count")
    public long contar(@PathVariable Long eventoId, @RequestParam String tipo) {
        return service.contarAsistentes(eventoId, tipo);
    }

    @GetMapping("/existe")
    public boolean yaAsistio(@RequestParam Long eventoId, @RequestParam Long userId, @RequestParam String tipo) {
        return service.yaAsistio(eventoId, userId, tipo);
    }
}
