package com.codecool.tasx.exception.company.project;

public class UserAlreadyInProjectException extends RuntimeException {
  public UserAlreadyInProjectException() {
    super("User is already in the project");
  }
}
