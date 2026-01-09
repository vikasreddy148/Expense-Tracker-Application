package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.enums.AuthProvider;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        return getOAuth2UserInfo(provider, attributes);
    }

    public static OAuth2UserInfo getOAuth2UserInfo(AuthProvider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> new GoogleOAuth2UserInfo(attributes);
            case GITHUB -> new GitHubOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException("Sorry! Login with " + provider + " is not supported yet.");
        };
    }
}

