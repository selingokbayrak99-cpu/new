package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -------------------------
    // LOGIN
    // -------------------------

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity.badRequest()
                    .body("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            return ResponseEntity.badRequest()
                    .body("Please verify your email before logging in");
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        Collections.emptyList()
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        HttpSession session = httpRequest.getSession(true);

        session.setAttribute(
                "SPRING_SECURITY_CONTEXT",
                context
        );

        return ResponseEntity.ok(user);
    }

    // -------------------------
    // CURRENT USER
    // -------------------------

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(401)
                    .body("Not authenticated");
        }

        SecurityContext context =
                (SecurityContext) session.getAttribute(
                        "SPRING_SECURITY_CONTEXT"
                );

        if (context == null ||
                context.getAuthentication() == null ||
                !context.getAuthentication().isAuthenticated()) {

            return ResponseEntity.status(401)
                    .body("Not authenticated");
        }

        String email =
                context.getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // -------------------------
    // LOGOUT
    // -------------------------

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(
                "Logged out successfully"
        );
    }
}