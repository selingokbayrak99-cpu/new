package com.example.backend;

import com.example.backend.entity.User;
import com.example.backend. repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class HealthController {

    private final UserRepository userRepository;

    public HealthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/health")
    public String health() {
        return "OKEY";
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }
}
