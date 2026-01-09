package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.dto.request.LoginRequest;
import com.expensetracker.expensetracker.dto.request.SignupRequest;
import com.expensetracker.expensetracker.dto.response.AuthResponse;
import com.expensetracker.expensetracker.dto.response.UserResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.authenticateUser(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authService.getCurrentUser();
        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .provider(user.getProvider())
                .roles(user.getRoles().stream()
                        .map(role -> "ROLE_" + role.name())
                        .collect(Collectors.toSet()))
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // In JWT-based authentication, logout is handled client-side by removing the token
        // This endpoint can be used for server-side session invalidation if needed
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

