package com.br.marcetech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.br.marcetech")
public class MarcetechApplication {
	public static void main(String[] args) {
		SpringApplication.run(MarcetechApplication.class, args);
	}
}
