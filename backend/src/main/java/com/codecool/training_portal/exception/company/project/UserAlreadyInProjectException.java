package com.codecool.training_portal.exception.company.project;

public class UserAlreadyInProjectException extends RuntimeException {
  public UserAlreadyInProjectException() {
    super("User is already in the project");
  }
}
