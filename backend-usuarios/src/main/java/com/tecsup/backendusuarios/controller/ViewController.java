package com.tecsup.backendusuarios.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() {
        return "redirect:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "redirect:/login.html";
    }

    @GetMapping("/anuncios")
    public String anuncios() {
        return "redirect:/listar-anuncios.html";
    }

    @GetMapping("/crear-anuncio")
    public String crearAnuncio() {
        return "redirect:/crear-anuncio.html";
    }
}
