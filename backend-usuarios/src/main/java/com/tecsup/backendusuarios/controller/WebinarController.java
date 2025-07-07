package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.model.Webinar;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.repository.WebinarRepository;
import com.tecsup.backendusuarios.repository.UserRepository;
import com.tecsup.backendusuarios.security.CurrentUser;
import com.tecsup.backendusuarios.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "*")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Webinar> getWebinarById(@PathVariable Long id) {
        return webinarRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    // MODIFICACIÓN 1: Permitir también a los ADMIN crear webinars
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createWebinar(@RequestBody Webinar webinar, @CurrentUser UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        webinar.setAutor(user);
        return ResponseEntity.ok(webinarRepository.save(webinar));
    }

    @PutMapping("/{id}")
    // MODIFICACIÓN 2: Permitir también a los ADMIN actualizar webinars
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Webinar> updateWebinar(@PathVariable Long id, @RequestBody Webinar webinarDetails,
                                                 @CurrentUser UserPrincipal currentUser) {
        return webinarRepository.findById(id)
                .map(webinar -> {
                    // MODIFICACIÓN 3: Añadir lógica para que los ADMIN puedan editar cualquier webinar
                    boolean isAdmin = currentUser.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    if (!webinar.getAutor().getId().equals(currentUser.getId()) && !isAdmin) {
                        throw new RuntimeException("No tienes permiso para editar este webinar");
                    }
                    if (webinarDetails.getTitulo() != null) webinar.setTitulo(webinarDetails.getTitulo());
                    if (webinarDetails.getDescripcion() != null) webinar.setDescripcion(webinarDetails.getDescripcion());
                    if (webinarDetails.getFecha() != null) webinar.setFecha(webinarDetails.getFecha());
                    if (webinarDetails.getEnlace() != null) webinar.setEnlace(webinarDetails.getEnlace());
                    if (webinarDetails.getExpositor() != null) webinar.setExpositor(webinarDetails.getExpositor());
                    if (webinarDetails.getImagen() != null) webinar.setImagen(webinarDetails.getImagen());
                    return ResponseEntity.ok(webinarRepository.save(webinar));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    // MODIFICACIÓN 4: Permitir también a los ADMIN eliminar webinars
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteWebinar(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        return webinarRepository.findById(id)
                .map(webinar -> {
                    // MODIFICACIÓN 5: Añadir lógica para que los ADMIN puedan eliminar cualquier webinar
                    boolean isAdmin = currentUser.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    if (!webinar.getAutor().getId().equals(currentUser.getId()) && !isAdmin) {
                        return ResponseEntity.badRequest().body("No tienes permiso para eliminar este webinar");
                    }
                    webinarRepository.delete(webinar);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/autor/{userId}")
    public List<Webinar> getWebinarsByAutor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return webinarRepository.findByAutor(user);
    }

    @GetMapping("/expositor/{expositor}")
    public List<Webinar> getWebinarsByExpositor(@PathVariable String expositor) {
        return webinarRepository.findByExpositor(expositor);
    }

    @GetMapping("/fechas")
    public List<Webinar> getWebinarsByFecha(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin) {
        return webinarRepository.findByFechaBetween(inicio, fin);
    }
}