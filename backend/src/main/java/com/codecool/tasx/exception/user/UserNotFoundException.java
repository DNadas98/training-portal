package com.codecool.tasx.exception.user;

public class UserNotFoundException extends RuntimeException {
  public UserNotFoundException(Long id) {
    super("User with ID " + id + " was not found");
  }

  public UserNotFoundException() {
    super("User was not found");
  }
}
