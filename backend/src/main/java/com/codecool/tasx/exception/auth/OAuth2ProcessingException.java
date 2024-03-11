package com.codecool.tasx.exception.auth;

public class OAuth2ProcessingException extends RuntimeException {
  public OAuth2ProcessingException() {
    super("An error occurred while processing the authentication request");
  }

  public OAuth2ProcessingException(String message) {
    super(message);
  }
}
