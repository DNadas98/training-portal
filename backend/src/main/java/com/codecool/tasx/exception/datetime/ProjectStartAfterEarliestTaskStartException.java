package com.codecool.tasx.exception.datetime;

public class ProjectStartAfterEarliestTaskStartException extends DateTimeBadRequestException {
  public ProjectStartAfterEarliestTaskStartException() {
    super("Project start date should not be later than earliest task start date in project");
  }
}
