package com.br.marcetech.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Marcetech API OK ✅";
    }

    @GetMapping("/teste")
    public String teste() {
        return "Marcetech Teste API OK ✅";
    }
}
