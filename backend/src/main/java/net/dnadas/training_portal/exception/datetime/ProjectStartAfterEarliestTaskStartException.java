package net.dnadas.training_portal.exception.datetime;

public class ProjectStartAfterEarliestTaskStartException extends DateTimeBadRequestException {
  public ProjectStartAfterEarliestTaskStartException() {
    super("Project start date should not be later than earliest task start date in project");
  }
}
