package com.codecool.training_portal.exception.company.project;

public class ProjectNotFoundException extends RuntimeException {
  private final Long id;

  public ProjectNotFoundException(Long id) {
    super("Project was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
