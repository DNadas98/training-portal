package net.dnadas.training_portal.exception.utils.datetime;

public class ProjectDeadlineBeforeLatestTaskDeadlineException extends DateTimeBadRequestException {
  public ProjectDeadlineBeforeLatestTaskDeadlineException() {
    super("Project deadline should not be earlier than latest task deadline in project");
  }
}
