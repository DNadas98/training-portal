package net.dnadas.training_portal.exception.group;

public class UserAlreadyInGroupException extends RuntimeException {
  public UserAlreadyInGroupException() {
    super("User is already member of the group");
  }
}
