package com.expensetracker.expensetracker.repository;

import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.enums.AuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by OAuth2 provider and provider ID
     * Used for OAuth2 authentication (Google, GitHub)
     */
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if OAuth2 user exists (by provider and provider ID)
     */
    boolean existsByProviderAndProviderId(AuthProvider provider, String providerId);
}

