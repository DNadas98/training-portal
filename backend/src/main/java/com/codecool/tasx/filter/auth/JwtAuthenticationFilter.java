package com.codecool.tasx.filter.auth;

import com.codecool.tasx.dto.auth.TokenPayloadDto;
import com.codecool.tasx.exception.auth.UnauthorizedException;
import com.codecool.tasx.exception.user.UserNotFoundException;
import com.codecool.tasx.model.auth.account.UserAccount;
import com.codecool.tasx.model.auth.account.UserAccountDao;
import com.codecool.tasx.model.user.ApplicationUser;
import com.codecool.tasx.model.user.ApplicationUserDao;
import com.codecool.tasx.service.auth.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * {@inheritDoc}
 * - Parses JWT access token from Authorization header<br/>
 * - Extracts subject ({@link TokenPayloadDto}) from token<br/>
 * - Reads {@link UserAccount} from database<br/>
 * - Creates internal {@link UsernamePasswordAuthenticationToken} from {@link UserAccount}
 * and adds it to the {@link SecurityContextHolder}<br/>
 *
 * @Expiration: Appends <code>isAccessTokenExpired: true</code> to the response object if
 * the token is expired
 * @see JwtService
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final UserAccountDao accountDao;
  private final ApplicationUserDao applicationUserDao;
  private final JwtService jwtService;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Override
  protected void doFilterInternal(
    @NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
    @NonNull FilterChain filterChain) throws IOException, ServletException {
    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      filterChain.doFilter(request, response);
      return;
    }
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }
    String accessToken = authHeader.split(" ")[1];

    try {
      if (jwtService.isAccessTokenExpired(accessToken)) {
        logger.error("Access Token is expired");
        setAccessTokenExpiredResponse(response);
        return;
      }

      TokenPayloadDto payload = jwtService.verifyAccessToken(accessToken);
      UserAccount account = accountDao.findOneByEmailAndAccountType(
        payload.email(), payload.accountType()).orElseThrow(() -> new UnauthorizedException());
      UsernamePasswordAuthenticationToken authenticationToken =
        getAuthenticationToken(account);

      SecurityContextHolder.getContext().setAuthentication(authenticationToken);
      filterChain.doFilter(request, response);
    } catch (JwtException | UnauthorizedException e) {
      logger.error(e.getMessage());
      setUnauthorizedResponse(response);
    }
  }

  private UsernamePasswordAuthenticationToken getAuthenticationToken(UserAccount account) {
    switch (account.getAccountType()) {
      case LOCAL -> {
        UserDetails userDetails = (UserDetails) account;
        return new UsernamePasswordAuthenticationToken(
          account.getApplicationUser().getId(), null, userDetails.getAuthorities()
        );
      }
      default -> {
        OAuth2User oAuth2User = (OAuth2User) account;
        return new UsernamePasswordAuthenticationToken(
          account.getApplicationUser().getId(), null, oAuth2User.getAuthorities()
        );
      }
    }
  }

  private void setAccessTokenExpiredResponse(HttpServletResponse response) throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter().write("{\"error\":\"Unauthorized\", \"isAccessTokenExpired\": true}");
  }

  private void setUnauthorizedResponse(HttpServletResponse response) throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter().write("{\"error\":\"Unauthorized\"}");
  }
}
