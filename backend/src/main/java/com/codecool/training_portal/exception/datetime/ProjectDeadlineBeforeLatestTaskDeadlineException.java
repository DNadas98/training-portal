package com.codecool.training_portal.exception.datetime;

public class ProjectDeadlineBeforeLatestTaskDeadlineException extends DateTimeBadRequestException {
  public ProjectDeadlineBeforeLatestTaskDeadlineException() {
    super("Project deadline should not be earlier than latest task deadline in project");
  }
}
