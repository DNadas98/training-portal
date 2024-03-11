package com.codecool.tasx.service.auth.oauth2;

import com.codecool.tasx.dto.auth.TokenPayloadDto;
import com.codecool.tasx.exception.auth.OAuth2ProcessingException;
import com.codecool.tasx.model.auth.account.OAuth2UserAccount;
import com.codecool.tasx.service.auth.CookieService;
import com.codecool.tasx.service.auth.RefreshService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
  private final AuthorizationRequestRepository<OAuth2AuthorizationRequest> requestRepository;
  private final RefreshService refreshService;
  private final CookieService cookieService;

  @Value("${BACKEND_OAUTH2_FRONTEND_REDIRECT_URI}")
  private String FRONTEND_REDIRECT_URI;


  @Override
  public void onAuthenticationSuccess(
    HttpServletRequest request, HttpServletResponse response, Authentication authentication)
    throws IOException, OAuth2ProcessingException {
    if (response.isCommitted()) {
      throw new OAuth2ProcessingException(
        "Unable to redirect to " + FRONTEND_REDIRECT_URI);
    }
    requestRepository.removeAuthorizationRequest(request, response);
    OAuth2UserAccount userAccount = getAccount(authentication);
    String refreshToken = refreshService.getNewRefreshToken(new TokenPayloadDto(
      userAccount.getEmail(), userAccount.getAccountType()
    ));
    cookieService.addRefreshCookie(refreshToken, response);
    super.getRedirectStrategy().sendRedirect(request, response, FRONTEND_REDIRECT_URI);
  }


  private OAuth2UserAccount getAccount(Authentication authentication)
    throws OAuth2ProcessingException {
    try {
      return (OAuth2UserAccount) authentication.getPrincipal();
    } catch (Exception e) {
      throw new OAuth2ProcessingException("Failed to parse Application User from context");
    }
  }
}
