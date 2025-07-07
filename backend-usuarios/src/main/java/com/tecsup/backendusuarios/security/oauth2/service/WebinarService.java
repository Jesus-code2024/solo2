package com.tecsup.backendusuarios.security.oauth2.service;

import com.tecsup.backendusuarios.model.Webinar;
import com.tecsup.backendusuarios.repository.WebinarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WebinarService {

    @Autowired
    private WebinarRepository webinarRepository;

    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    public Optional<Webinar> getWebinarById(Long id) {
        return webinarRepository.findById(id);
    }

    public Webinar createWebinar(Webinar webinar) {
        return webinarRepository.save(webinar);
    }

    public Webinar updateWebinar(Long id, Webinar webinarDetails) {
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar no encontrado con id: " + id));

        webinar.setTitulo(webinarDetails.getTitulo());
        webinar.setDescripcion(webinarDetails.getDescripcion());
        webinar.setFecha(webinarDetails.getFecha());
        webinar.setEnlace(webinarDetails.getEnlace());
        webinar.setExpositor(webinarDetails.getExpositor());
        webinar.setImagen(webinarDetails.getImagen());
        // **********************************************
        // Asegúrate de actualizar el campo destacado también
        webinar.setDestacado(webinarDetails.isDestacado());
        // **********************************************
        webinar.setAutor(webinarDetails.getAutor()); // Asegúrate de que el autor se maneje correctamente

        return webinarRepository.save(webinar);
    }

    public void deleteWebinar(Long id) {
        webinarRepository.deleteById(id);
    }

    // **********************************************
    // Nuevo método de servicio para webinars destacados
    public List<Webinar> getWebinarsDestacados() {
        // Puedes usar findByDestacadoTrueOrderByFechaDesc() si prefieres ordenar
        return webinarRepository.findByDestacadoTrue();
    }
    // **********************************************
}