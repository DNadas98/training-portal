package com.codecool.tasx.exception.datetime;

public class StartAfterDeadlineException extends DateTimeBadRequestException {
  public StartAfterDeadlineException() {
    super("Start date should be earlier than deadline");
  }
}
