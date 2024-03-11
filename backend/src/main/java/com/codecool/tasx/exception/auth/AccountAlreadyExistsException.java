package com.codecool.tasx.exception.auth;

public class AccountAlreadyExistsException extends RuntimeException {
  public AccountAlreadyExistsException() {
    super("User account already exists");
  }

  public AccountAlreadyExistsException(String message) {
    super(message);
  }
}
