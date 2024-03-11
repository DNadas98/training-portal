package com.codecool.tasx.exception.auth;

public class OnlyOneAccountFoundException extends RuntimeException {
  public OnlyOneAccountFoundException() {
    super("No other user accounts were found");
  }
}
