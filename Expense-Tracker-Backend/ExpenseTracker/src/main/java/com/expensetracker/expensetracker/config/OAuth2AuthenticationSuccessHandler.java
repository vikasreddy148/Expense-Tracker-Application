package com.expensetracker.expensetracker.config;

import com.expensetracker.expensetracker.service.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);
    
    private final JwtTokenProvider tokenProvider;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/auth/callback}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       Authentication authentication) throws IOException {
        
        String targetUrl = determineTargetUrl(request, response, authentication);
        
        logger.info("OAuth2 authentication successful. Redirecting to: {}", targetUrl);
        
        if (response.isCommitted()) {
            logger.error("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }
        
        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        String token = tokenProvider.generateToken(
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getAuthorities()
        );
        
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("username", userPrincipal.getUsername())
                .queryParam("email", userPrincipal.getEmail())
                .queryParam("provider", userPrincipal.getProvider() != null ? userPrincipal.getProvider().name() : "LOCAL")
                .build()
                .encode()
                .toUriString();
        
        logger.debug("Generated OAuth2 callback URL for user: {}", userPrincipal.getEmail());
        
        return targetUrl;
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
    }
}

