package com.tea_management.tea_backend;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TeaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeaBackendApplication.class, args);
	}

	// Add this Bean so you can Autowire ModelMapper in your Service
	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
}