package com.codecool.tasx.exception.datetime;

public class ProjectDeadlineBeforeLatestTaskDeadlineException extends DateTimeBadRequestException {
  public ProjectDeadlineBeforeLatestTaskDeadlineException() {
    super("Project deadline should not be earlier than latest task deadline in project");
  }
}
