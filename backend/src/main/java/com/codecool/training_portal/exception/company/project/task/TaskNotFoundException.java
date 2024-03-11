package com.codecool.training_portal.exception.company.project.task;

public class TaskNotFoundException extends RuntimeException {
  private final Long id;

  public TaskNotFoundException(Long id) {
    super("Task with ID " + id + " was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
