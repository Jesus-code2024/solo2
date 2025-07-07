package com.tecsup.backendusuarios.security.oauth2.service;

import com.tecsup.backendusuarios.model.Evento;
import com.tecsup.backendusuarios.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public Optional<Evento> getEventoById(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento createEvento(Evento evento) {
        // Al crear un evento, si no se especifica 'destacado', por defecto podría ser false
        // o podrías requerir que el cliente lo envíe
        return eventoRepository.save(evento);
    }

    public Evento updateEvento(Long id, Evento eventoDetails) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con id: " + id)); // O tu excepción personalizada

        evento.setTitulo(eventoDetails.getTitulo());
        evento.setDescripcion(eventoDetails.getDescripcion());
        evento.setUbicacion(eventoDetails.getUbicacion());
        evento.setFechaInicio(eventoDetails.getFechaInicio());
        evento.setFechaFin(eventoDetails.getFechaFin());
        evento.setCapacidad(eventoDetails.getCapacidad());
        evento.setImagen(eventoDetails.getImagen());
        // **********************************************
        // Asegúrate de actualizar el campo destacado también
        evento.setDestacado(eventoDetails.isDestacado());
        // **********************************************
        evento.setCarrera(eventoDetails.getCarrera());
        evento.setAutor(eventoDetails.getAutor()); // Asegúrate de que el autor y carrera se manejen correctamente

        return eventoRepository.save(evento);
    }

    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    // **********************************************
    // Nuevo método de servicio para eventos destacados
    public List<Evento> getEventosDestacados() {
        // Puedes usar findByDestacadoTrueOrderByFechaInicioDesc() si prefieres ordenar
        return eventoRepository.findByDestacadoTrue();
    }
    // **********************************************
}