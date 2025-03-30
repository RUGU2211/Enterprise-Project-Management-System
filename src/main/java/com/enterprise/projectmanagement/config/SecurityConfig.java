package com.enterprise.projectmanagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // For development only - enable in production
                .authorizeHttpRequests(auth -> auth
                        // Static resources
                        .requestMatchers("/assets/**", "/js/**", "/css/**", "/views/**", "/components/**",
                                "/*.html", "/", "/index.html", "/login", "/register",
                                "/resources/**", "/static/**").permitAll()
                        // Public API endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // Protected API endpoints
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/views/auth/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/views/dashboard/index.html")
                        .failureUrl("/views/auth/login.html?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/views/auth/login.html?logout=true")
                        .permitAll()
                );

        return http.build();
    }
}