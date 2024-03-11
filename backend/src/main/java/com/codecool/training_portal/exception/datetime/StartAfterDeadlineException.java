package com.codecool.training_portal.exception.datetime;

public class StartAfterDeadlineException extends DateTimeBadRequestException {
  public StartAfterDeadlineException() {
    super("Start date should be earlier than deadline");
  }
}
