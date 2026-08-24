package com.example.backend.controller;

import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.EmailVerificationToken;
import com.example.backend.entity.User;
import com.example.backend.repository.EmailVerificationTokenRepository;
import com.example.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationTokenRepository emailVerificationTokenRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequest request) {

        // Email daha önce kayıt edilmiş mi?
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("This email is already registered.");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setYearOfBirth(request.getYearOfBirth());
        user.setGender(request.getGender());

        user.setEmailVerified(false);

        User savedUser = userRepository.save(user);

        EmailVerificationToken verificationToken =
                new EmailVerificationToken();

        verificationToken.setToken(
                UUID.randomUUID().toString()
        );

        verificationToken.setUser(savedUser);

        verificationToken.setExpiresAt(
                LocalDateTime.now().plusHours(24)
        );

        emailVerificationTokenRepository.save(verificationToken);

        String verificationLink =
                "http://localhost:8080/auth/verify-email?token="
                        + verificationToken.getToken();

        System.out.println("========================================");
        System.out.println("EMAIL VERIFICATION LINK:");
        System.out.println(verificationLink);
        System.out.println("========================================");

        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token) {

        EmailVerificationToken verificationToken =
                emailVerificationTokenRepository.findByToken(token)
                        .orElse(null);

        if (verificationToken == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid verification token");
        }

        if (verificationToken.getUsedAt() != null) {
            return ResponseEntity.badRequest()
                    .body("Verification token has already been used");
        }

        if (verificationToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            return ResponseEntity.badRequest()
                    .body("Verification token has expired");
        }

        User user = verificationToken.getUser();

        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(verificationToken);

        return ResponseEntity.ok(
                "Email verified successfully"
        );
    }
}