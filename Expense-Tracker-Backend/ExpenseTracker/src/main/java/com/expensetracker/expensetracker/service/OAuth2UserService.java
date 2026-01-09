package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.entity.User;
import com.expensetracker.expensetracker.enums.AuthProvider;
import com.expensetracker.expensetracker.enums.Role;
import com.expensetracker.expensetracker.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (OAuth2AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("oauth2_user_processing_error", "Error processing OAuth2 user", null),
                e
            );
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(provider, oAuth2User.getAttributes());
        
        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("email_not_found", "Email not found from OAuth2 provider", null)
            );
        }

        // Check if user already exists
        User user = userRepository.findByProviderAndProviderId(provider, oAuth2UserInfo.getId())
                .orElse(null);

        if (user != null) {
            // Update existing user
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            // Check if user exists with same email but different provider
            user = userRepository.findByEmail(oAuth2UserInfo.getEmail())
                    .orElse(null);
            
            if (user != null) {
                // Link OAuth2 account to existing user
                user.setProvider(provider);
                user.setProviderId(oAuth2UserInfo.getId());
                user = userRepository.save(user);
            } else {
                // Create new user
                user = registerNewUser(provider, oAuth2UserInfo);
            }
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(AuthProvider provider, OAuth2UserInfo oAuth2UserInfo) {
        User user = User.builder()
                .username(oAuth2UserInfo.getName())
                .email(oAuth2UserInfo.getEmail())
                .provider(provider)
                .providerId(oAuth2UserInfo.getId())
                .roles(new HashSet<>(Set.of(Role.USER)))
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setUsername(oAuth2UserInfo.getName());
        return userRepository.save(existingUser);
    }
}

