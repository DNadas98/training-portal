package com.codecool.training_portal.filter.auth;

import com.codecool.training_portal.dto.auth.TokenPayloadDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.service.auth.JwtService;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  /**
   * Filters incoming requests to check for JWT authentication.
   * If the request contains a valid JWT access token, it sets the authentication in the security context.
   * If the access token is expired or invalid, it returns an unauthorized response.
   *
   * @param request     The incoming HTTP request.
   * @param response    The HTTP response.
   * @param filterChain The filter chain to continue processing the request.
   * @throws IOException      If an I/O error occurs.
   * @throws ServletException If a servlet error occurs.
   */
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
      UserDetails user = userDetailsService.loadUserByUsername(payload.email());
      UsernamePasswordAuthenticationToken authenticationToken =
        new UsernamePasswordAuthenticationToken(
          ((ApplicationUser) user).getId(), null, user.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authenticationToken);
      filterChain.doFilter(request, response);
    } catch (JwtException | UnauthorizedException e) {
      logger.error(e.getMessage());
      setUnauthorizedResponse(response);
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
