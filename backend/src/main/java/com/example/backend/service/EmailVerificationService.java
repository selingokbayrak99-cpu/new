package com.example.backend.service;

import com.example.backend.entity.EmailVerificationToken;
import com.example.backend.entity.User;
import com.example.backend.repository.EmailVerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;

    public EmailVerificationService(
            EmailVerificationTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String createVerificationToken(User user) {

        EmailVerificationToken verificationToken =
                new EmailVerificationToken();

        verificationToken.setToken(
                UUID.randomUUID().toString()
        );

        verificationToken.setUser(user);

        verificationToken.setExpiresAt(
                LocalDateTime.now().plusHours(24)
        );

        tokenRepository.save(verificationToken);

        return "http://localhost:8080/auth/verify-email?token="
                + verificationToken.getToken();
    }
}
