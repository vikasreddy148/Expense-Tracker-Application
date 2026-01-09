package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.dto.response.AuthResponse;
import com.expensetracker.expensetracker.enums.AuthProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/auth/oauth2")
public class OAuth2Controller {

    @GetMapping("/success")
    public ResponseEntity<AuthResponse> oauth2Success(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String provider) {
        
        // This endpoint is called after successful OAuth2 authentication
        // The token is passed as a query parameter from OAuth2AuthenticationSuccessHandler
        AuthProvider authProvider = AuthProvider.LOCAL;
        if (provider != null && !provider.isEmpty()) {
            try {
                authProvider = AuthProvider.valueOf(provider.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Default to LOCAL if provider is invalid
                authProvider = AuthProvider.LOCAL;
            }
        }
        
        AuthResponse response = AuthResponse.builder()
                .token(token != null ? token : "")
                .username(username != null ? username : "")
                .email(email != null ? email : "")
                .provider(authProvider)
                .roles(Set.of("ROLE_USER"))
                .build();
        
        return ResponseEntity.ok(response);
    }
}

