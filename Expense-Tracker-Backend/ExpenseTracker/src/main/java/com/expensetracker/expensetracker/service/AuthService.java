package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.config.JwtTokenProvider;
import com.expensetracker.expensetracker.dto.request.LoginRequest;
import com.expensetracker.expensetracker.dto.request.SignupRequest;
import com.expensetracker.expensetracker.dto.response.AuthResponse;
import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.enums.AuthProvider;
import com.expensetracker.expensetracker.enums.Role;
import com.expensetracker.expensetracker.exception.BadRequestException;
import com.expensetracker.expensetracker.exception.UnauthorizedException;
import com.expensetracker.expensetracker.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtTokenProvider tokenProvider,
                      @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse registerUser(SignupRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider(AuthProvider.LOCAL)
                .roles(new HashSet<>(Set.of(Role.USER)))
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Generate JWT token
        String token = generateJwtToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .provider(user.getProvider())
                .roles(user.getRoles().stream()
                        .map(role -> "ROLE_" + role.name())
                        .collect(Collectors.toSet()))
                .build();
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        try {
            // Try to authenticate with username first
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Load user
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

            // Generate JWT token
            String token = generateJwtToken(user);

            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .provider(user.getProvider())
                    .roles(user.getRoles().stream()
                            .map(role -> "ROLE_" + role.name())
                            .collect(Collectors.toSet()))
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid username or password");
        }
    }

    public String generateJwtToken(User user) {
        return tokenProvider.generateToken(
                user.getUsername(),
                user.getEmail(),
                user.getAuthorities()
        );
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        return UserPrincipal.create(user);
    }
}

