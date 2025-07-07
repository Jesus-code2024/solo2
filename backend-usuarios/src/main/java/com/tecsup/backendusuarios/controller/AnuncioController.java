package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.model.Anuncio;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.model.Carrera;
import com.tecsup.backendusuarios.model.Departamento;
import com.tecsup.backendusuarios.model.TipoAnuncio;
import com.tecsup.backendusuarios.repository.AnuncioRepository;
import com.tecsup.backendusuarios.repository.UserRepository;
import com.tecsup.backendusuarios.repository.CarreraRepository;
import com.tecsup.backendusuarios.repository.DepartamentoRepository;
import com.tecsup.backendusuarios.security.CurrentUser;
import com.tecsup.backendusuarios.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "*")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarreraRepository carreraRepository;

    @Autowired
    private DepartamentoRepository departamentoRepository;

    // Obtener todos los anuncios
    @GetMapping
    public List<Anuncio> getAllAnuncios() {
        return anuncioRepository.findAll();
    }

    // Obtener un anuncio por ID
    @GetMapping("/{id}")
    public ResponseEntity<Anuncio> getAnuncioById(@PathVariable Long id) {
        return anuncioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear un nuevo anuncio
    @PostMapping
    // MODIFICACIÓN 1: Permitir también a los ADMIN crear anuncios
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createAnuncio(@RequestBody Anuncio anuncio, @CurrentUser UserPrincipal currentUser) {
        try {
            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Validar y establecer relaciones según el tipo de anuncio
            if (anuncio.getTipo() == TipoAnuncio.CAR && anuncio.getCarrera() != null) {
                Carrera carrera = carreraRepository.findById(anuncio.getCarrera().getId())
                        .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));
                anuncio.setCarrera(carrera);
                anuncio.setDepartamento(null);
            } else if (anuncio.getTipo() == TipoAnuncio.DEP && anuncio.getDepartamento() != null) {
                Departamento departamento = departamentoRepository.findById(anuncio.getDepartamento().getId())
                        .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
                anuncio.setDepartamento(departamento);
                anuncio.setCarrera(null);
            } else if (anuncio.getTipo() == TipoAnuncio.GEN) {
                anuncio.setCarrera(null);
                anuncio.setDepartamento(null);
            }

            anuncio.setAutor(user);
            Anuncio savedAnuncio = anuncioRepository.save(anuncio);
            return ResponseEntity.ok(savedAnuncio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el anuncio: " + e.getMessage());
        }
    }

    // Actualizar un anuncio
    @PutMapping("/{id}")
    // MODIFICACIÓN 2: Permitir también a los ADMIN actualizar anuncios
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Anuncio> updateAnuncio(@PathVariable Long id, @RequestBody Anuncio anuncioDetails,
                                                 @CurrentUser UserPrincipal currentUser) {
        return anuncioRepository.findById(id)
                .map(anuncio -> {
                    // MODIFICACIÓN 3: Añadir lógica para que los ADMIN puedan editar cualquier anuncio
                    boolean isAdmin = currentUser.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    if (!anuncio.getAutor().getId().equals(currentUser.getId()) && !isAdmin) {
                        throw new RuntimeException("No tienes permiso para editar este anuncio");
                    }

                    if (anuncioDetails.getTitulo() != null) anuncio.setTitulo(anuncioDetails.getTitulo());
                    if (anuncioDetails.getContenido() != null) anuncio.setContenido(anuncioDetails.getContenido());
                    if (anuncioDetails.getTipo() != null) {
                        anuncio.setTipo(anuncioDetails.getTipo());
                        // Actualizar relaciones según el nuevo tipo
                        if (anuncioDetails.getTipo() == TipoAnuncio.CAR && anuncioDetails.getCarrera() != null) {
                            Carrera carrera = carreraRepository.findById(anuncioDetails.getCarrera().getId())
                                    .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));
                            anuncio.setCarrera(carrera);
                            anuncio.setDepartamento(null);
                        } else if (anuncioDetails.getTipo() == TipoAnuncio.DEP && anuncioDetails.getDepartamento() != null) {
                            Departamento departamento = departamentoRepository.findById(anuncioDetails.getDepartamento().getId())
                                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
                            anuncio.setDepartamento(departamento);
                            anuncio.setCarrera(null);
                        } else if (anuncioDetails.getTipo() == TipoAnuncio.GEN) {
                            anuncio.setCarrera(null);
                            anuncio.setDepartamento(null);
                        }
                    }

                    return ResponseEntity.ok(anuncioRepository.save(anuncio));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar un anuncio
    @DeleteMapping("/{id}")
    // MODIFICACIÓN 4: Permitir también a los ADMIN eliminar anuncios
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAnuncio(@PathVariable Long id, @CurrentUser UserPrincipal currentUser) {
        return anuncioRepository.findById(id)
                .map(anuncio -> {
                    // MODIFICACIÓN 5: Añadir lógica para que los ADMIN puedan eliminar cualquier anuncio
                    boolean isAdmin = currentUser.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    if (!anuncio.getAutor().getId().equals(currentUser.getId()) && !isAdmin) {
                        return ResponseEntity.badRequest().body("No tienes permiso para eliminar este anuncio");
                    }
                    anuncioRepository.delete(anuncio);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener anuncios por usuario autor
    @GetMapping("/autor/{userId}")
    public List<Anuncio> getAnunciosByAutor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return anuncioRepository.findByAutor(user);
    }

    // Obtener anuncios por tipo
    @GetMapping("/tipo/{tipo}")
    public List<Anuncio> getAnunciosByTipo(@PathVariable TipoAnuncio tipo) {
        return anuncioRepository.findByTipo(tipo);
    }

    // Obtener anuncios por carrera
    @GetMapping("/carrera/{carreraId}")
    public List<Anuncio> getAnunciosByCarrera(@PathVariable Long carreraId) {
        Carrera carrera = carreraRepository.findById(carreraId)
                .orElseThrow(() -> new RuntimeException("Carrera no encontrada"));
        return anuncioRepository.findByTipoAndCarrera(TipoAnuncio.CAR, carrera);
    }

    // Obtener anuncios por departamento
    @GetMapping("/departamento/{departamentoId}")
    public List<Anuncio> getAnunciosByDepartamento(@PathVariable Long departamentoId) {
        Departamento departamento = departamentoRepository.findById(departamentoId)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
        return anuncioRepository.findByTipoAndDepartamento(TipoAnuncio.DEP, departamento);
    }
}