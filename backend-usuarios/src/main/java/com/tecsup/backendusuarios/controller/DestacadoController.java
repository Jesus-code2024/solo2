package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.model.Evento;
import com.tecsup.backendusuarios.model.Webinar;
import com.tecsup.backendusuarios.security.oauth2.service.EventoService;
import com.tecsup.backendusuarios.security.oauth2.service.WebinarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap; // Necesario para HashMap
import java.util.List;
import java.util.Map;   // Necesario para Map
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/destacados")
@CrossOrigin(origins = "http://localhost:3000") // Permite solicitudes desde tu frontend React
public class DestacadoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private WebinarService webinarService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getContenidoDestacado() {
        // Cambiamos el tipo de retorno a List<Map<String, Object>>
        List<Map<String, Object>> destacadosConTipo = new ArrayList<>();

        // Obtener eventos destacados
        List<Evento> eventosDestacados = eventoService.getEventosDestacados();
        for (Evento evento : eventosDestacados) {
            Map<String, Object> eventoMap = new HashMap<>();
            eventoMap.put("id", evento.getId());
            eventoMap.put("titulo", evento.getTitulo());
            eventoMap.put("descripcion", evento.getDescripcion());
            eventoMap.put("fechaInicio", evento.getFechaInicio()); // Asegúrate de que este campo exista en Evento
            eventoMap.put("fechaFin", evento.getFechaFin());       // Asegúrate de que este campo exista en Evento
            eventoMap.put("ubicacion", evento.getUbicacion());
            eventoMap.put("imagen", evento.getImagen());
            eventoMap.put("destacado", evento.isDestacado());
            // Si tu Evento tiene una propiedad 'carrera', también la podrías añadir
            // if (evento.getCarrera() != null) {
            //     eventoMap.put("carrera", evento.getCarrera());
            // }
            // if (evento.getAutor() != null) {
            //     eventoMap.put("autor", evento.getAutor());
            // }

            eventoMap.put("tipo", "evento"); // <--- ¡AÑADIMOS LA PROPIEDAD TIPO!
            destacadosConTipo.add(eventoMap);
        }

        // Obtener webinars destacados
        List<Webinar> webinarsDestacados = webinarService.getWebinarsDestacados();
        for (Webinar webinar : webinarsDestacados) {
            Map<String, Object> webinarMap = new HashMap<>();
            webinarMap.put("id", webinar.getId());
            webinarMap.put("titulo", webinar.getTitulo());
            webinarMap.put("descripcion", webinar.getDescripcion());
            webinarMap.put("fecha", webinar.getFecha()); // Asegúrate de que este campo exista en Webinar
            webinarMap.put("enlace", webinar.getEnlace());
            webinarMap.put("expositor", webinar.getExpositor());
            webinarMap.put("imagen", webinar.getImagen());
            webinarMap.put("destacado", webinar.isDestacado());
            // if (webinar.getAutor() != null) {
            //     webinarMap.put("autor", webinar.getAutor());
            // }

            webinarMap.put("tipo", "webinar"); // <--- ¡AÑADIMOS LA PROPIEDAD TIPO!
            destacadosConTipo.add(webinarMap);
        }

        // Opcional: Mezclar y limitar el número de destacados para el carrusel
        if (!destacadosConTipo.isEmpty()) {
            Collections.shuffle(destacadosConTipo); // Mezcla aleatoriamente los elementos
        }

        // Limita a un máximo de 5 elementos para el carrusel (puedes ajustar este número)
        List<Map<String, Object>> topDestacados = destacadosConTipo.stream().limit(5).collect(Collectors.toList());

        return ResponseEntity.ok(topDestacados);
    }
}