package com.codecool.tasx.exception.auth;

public class AccountLinkingRequiredException extends RuntimeException {
  public AccountLinkingRequiredException() {
    super(
      "User account with the provided credentials address already exists. Account linking is required to proceed");
  }
}
