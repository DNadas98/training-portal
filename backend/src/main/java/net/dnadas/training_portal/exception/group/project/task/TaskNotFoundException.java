package net.dnadas.training_portal.exception.group.project.task;

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
