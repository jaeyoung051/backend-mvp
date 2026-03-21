package com.seo051.backend;

import com.seo051.backend.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class BackendMvpApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendMvpApplication.class, args);
	}
}
