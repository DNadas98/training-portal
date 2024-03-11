package com.codecool.training_portal.exception.company.project;

public class DuplicateProjectJoinRequestException extends RuntimeException {
  public DuplicateProjectJoinRequestException() {
    super("Project join request already exists");
  }
}
