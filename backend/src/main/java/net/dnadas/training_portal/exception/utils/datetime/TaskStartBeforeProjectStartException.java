package net.dnadas.training_portal.exception.utils.datetime;

public class TaskStartBeforeProjectStartException extends DateTimeBadRequestException {
  public TaskStartBeforeProjectStartException() {
    super("Task start date should not be earlier than project start date");
  }
}
