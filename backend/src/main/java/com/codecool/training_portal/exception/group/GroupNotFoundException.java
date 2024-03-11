package com.codecool.training_portal.exception.group;

public class GroupNotFoundException extends RuntimeException {
  private final Long id;

  public GroupNotFoundException(Long id) {
    super("UserGroup with ID " + id + " was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
