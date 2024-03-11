package com.codecool.tasx.exception.datetime;

public class TaskStartBeforeProjectStartException extends DateTimeBadRequestException {
  public TaskStartBeforeProjectStartException() {
    super("Task start date should not be earlier than project start date");
  }
}
