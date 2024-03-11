package com.codecool.training_portal.service.auth;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class CookieService {
  //JWT Auth

  public void addRefreshCookie(String refreshToken, HttpServletResponse response) {
    response.setHeader(
      "Set-Cookie",
      "jwt=" + refreshToken + "; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth;");
  }

  public void clearRefreshCookie(HttpServletResponse response) {
    response.setHeader(
      "Set-Cookie", "jwt=; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth;");
  }
}
