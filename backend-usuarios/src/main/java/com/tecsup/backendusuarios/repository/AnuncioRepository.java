package com.tecsup.backendusuarios.repository;

import com.tecsup.backendusuarios.model.Anuncio;
import com.tecsup.backendusuarios.model.User;
import com.tecsup.backendusuarios.model.Carrera;
import com.tecsup.backendusuarios.model.Departamento;
import com.tecsup.backendusuarios.model.TipoAnuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {
    List<Anuncio> findByAutor(User autor);
    List<Anuncio> findByTipo(TipoAnuncio tipo);
    List<Anuncio> findByCarrera(Carrera carrera);
    List<Anuncio> findByDepartamento(Departamento departamento);
    List<Anuncio> findByTipoAndCarrera(TipoAnuncio tipo, Carrera carrera);
    List<Anuncio> findByTipoAndDepartamento(TipoAnuncio tipo, Departamento departamento);
}