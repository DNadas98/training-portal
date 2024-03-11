package com.codecool.tasx.exception.datetime;

public class TaskDeadlineAfterProjectDeadlineException extends DateTimeBadRequestException {
  public TaskDeadlineAfterProjectDeadlineException() {
    super("Task deadline should not be later than project deadline");
  }
}
