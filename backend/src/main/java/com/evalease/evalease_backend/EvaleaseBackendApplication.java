package com.evalease.evalease_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import com.evalease.evalease_backend.entity.Employee;
import com.evalease.evalease_backend.entity.Role;
import com.evalease.evalease_backend.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableAsync
public class EvaleaseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EvaleaseBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(EmployeeRepository repository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!repository.findByEmail("admin@gmail.com").isPresent()) {
				Employee admin = Employee.builder()
						.name("Admin")
						.email("admin@gmail.com")
						.password(passwordEncoder.encode("1234"))
						.role(Role.ADMIN)
						.build();
				repository.save(admin);
				System.out.println("Default admin user created: admin@gmail.com / 1234");
			}
		};
	}

}
