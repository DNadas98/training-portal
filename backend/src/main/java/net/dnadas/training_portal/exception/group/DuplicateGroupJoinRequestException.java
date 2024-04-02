package net.dnadas.training_portal.exception.group;

public class DuplicateGroupJoinRequestException extends RuntimeException {
  public DuplicateGroupJoinRequestException() {
    super("UserGroup join request already exists");
  }
}
