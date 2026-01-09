package com.expensetracker.expensetracker.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);
    
    @Value("${app.oauth2.redirect-uri:http://localhost:3000/auth/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                      HttpServletResponse response,
                                      AuthenticationException exception) throws IOException {
        
        String errorMessage = exception.getMessage();
        if (errorMessage == null || errorMessage.isEmpty()) {
            errorMessage = "OAuth2 authentication failed";
        }
        
        logger.error("OAuth2 authentication failed: {}", errorMessage, exception);
        
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("error", "authentication_failed")
                .queryParam("message", errorMessage)
                .build()
                .encode()
                .toUriString();
        
        logger.info("Redirecting to frontend with error: {}", targetUrl);
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}

