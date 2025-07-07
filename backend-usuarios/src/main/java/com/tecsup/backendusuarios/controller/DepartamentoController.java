package com.tecsup.backendusuarios.controller;

import com.tecsup.backendusuarios.model.Departamento;
import com.tecsup.backendusuarios.repository.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
@CrossOrigin(origins = "*")
public class DepartamentoController {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @GetMapping
    public List<Departamento> getAllDepartamentos() {
        return departamentoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> getDepartamentoById(@PathVariable Long id) {
        return departamentoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Departamento createDepartamento(@RequestBody Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Departamento> updateDepartamento(@PathVariable Long id, @RequestBody Departamento departamentoDetails) {
        return departamentoRepository.findById(id)
                .map(departamento -> {
                    if (departamentoDetails.getCodigo() != null) departamento.setCodigo(departamentoDetails.getCodigo());
                    if (departamentoDetails.getNombre() != null) departamento.setNombre(departamentoDetails.getNombre());
                    if (departamentoDetails.getResponsable() != null) departamento.setResponsable(departamentoDetails.getResponsable());
                    return ResponseEntity.ok(departamentoRepository.save(departamento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDepartamento(@PathVariable Long id) {
        return departamentoRepository.findById(id)
                .map(departamento -> {
                    departamentoRepository.delete(departamento);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Departamento> getDepartamentoByCodigo(@PathVariable String codigo) {
        return departamentoRepository.findByCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
