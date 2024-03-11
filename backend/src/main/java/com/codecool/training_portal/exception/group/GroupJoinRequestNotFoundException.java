package com.codecool.training_portal.exception.group;

public class GroupJoinRequestNotFoundException extends RuntimeException {
  private final Long id;

  public GroupJoinRequestNotFoundException(Long id) {
    super("UserGroup join request with ID " + id + " was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
