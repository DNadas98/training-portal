package com.codecool.tasx.service.auth.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

  private final AuthorizationRequestRepository<OAuth2AuthorizationRequest> requestRepository;
  @Value("${BACKEND_OAUTH2_FRONTEND_REDIRECT_URI}")
  private String FRONTEND_REDIRECT_URI;

  @Override
  public void onAuthenticationFailure(
    HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
    throws IOException {
    requestRepository.removeAuthorizationRequest(request, response);

    String errorMessage = exception.getMessage() == null
      ? "An error occurred while processing the authentication request"
      : exception.getMessage();

    String redirectUrl = UriComponentsBuilder.fromUriString(FRONTEND_REDIRECT_URI)
      .queryParam("error", URLEncoder.encode(errorMessage))
      .build().toUriString();
    getRedirectStrategy().sendRedirect(request, response, redirectUrl);
  }
}
