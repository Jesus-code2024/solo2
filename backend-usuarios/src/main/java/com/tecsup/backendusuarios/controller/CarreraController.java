package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.model.Carrera;
import com.tecsup.backendusuarios.repository.CarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // Importar Collectors para usar en el stream

@RestController
@RequestMapping("/api/carreras")
@CrossOrigin(origins = "*")
public class CarreraController {

    @Autowired
    private CarreraRepository carreraRepository;

    // Método de utilidad para limpiar la ruta de la imagen
    // Esto es fundamental para evitar la duplicación de la URL base en el frontend
    private String cleanImagePath(String imagePath) {
        if (imagePath != null && imagePath.startsWith("http://localhost:8080/uploads/")) {
            return imagePath.replace("http://localhost:8080/uploads/", "");
        }
        return imagePath;
    }

    @GetMapping
    public List<Carrera> getAllCarreras() {
        // Al obtener todas las carreras, limpia la ruta de la imagen para cada una.
        return carreraRepository.findAll().stream()
                .peek(carrera -> carrera.setImagen(cleanImagePath(carrera.getImagen())))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carrera> getCarreraById(@PathVariable Long id) {
        return carreraRepository.findById(id)
                .map(carrera -> {
                    // Al obtener una carrera por ID, limpia la ruta de la imagen.
                    carrera.setImagen(cleanImagePath(carrera.getImagen()));
                    return ResponseEntity.ok(carrera);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Carrera createCarrera(@RequestBody Carrera carrera) {
        // Al crear una carrera, asegúrate de que si la imagen viene con la URL completa,
        // solo se guarde el nombre del archivo en la base de datos.
        carrera.setImagen(cleanImagePath(carrera.getImagen())); // Limpia antes de guardar
        return carreraRepository.save(carrera);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Carrera> updateCarrera(@PathVariable Long id, @RequestBody Carrera carreraDetails) {
        return carreraRepository.findById(id)
                .map(carrera -> {
                    if (carreraDetails.getCodigo() != null) carrera.setCodigo(carreraDetails.getCodigo());
                    if (carreraDetails.getNombre() != null) carrera.setNombre(carreraDetails.getNombre());
                    if (carreraDetails.getDescripcion() != null) carrera.setDescripcion(carreraDetails.getDescripcion());
                    // Al actualizar, también limpia la ruta de la imagen antes de guardar
                    if (carreraDetails.getImagen() != null) {
                        carrera.setImagen(cleanImagePath(carreraDetails.getImagen()));
                    }
                    return ResponseEntity.ok(carreraRepository.save(carrera));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCarrera(@PathVariable Long id) {
        return carreraRepository.findById(id)
                .map(carrera -> {
                    carreraRepository.delete(carrera);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Carrera> getCarreraByCodigo(@PathVariable String codigo) {
        return carreraRepository.findByCodigo(codigo)
                .map(carrera -> {
                    // También limpia la ruta de la imagen al buscar por código
                    carrera.setImagen(cleanImagePath(carrera.getImagen()));
                    return ResponseEntity.ok(carrera);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}