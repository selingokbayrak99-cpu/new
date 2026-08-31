package com.example.backend.controller;

import com.example.backend.entity.EmailVerificationToken;
import com.example.backend.entity.User;
import com.example.backend.repository.EmailVerificationTokenRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class EmailVerificationController {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    public EmailVerificationController(
            UserRepository userRepository,
            EmailVerificationTokenRepository emailVerificationTokenRepository) {

        this.userRepository = userRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
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