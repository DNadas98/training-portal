package net.dnadas.training_portal.exception.group.project;

public class UserAlreadyInProjectException extends RuntimeException {
  public UserAlreadyInProjectException() {
    super("User is already in the project");
  }
}
