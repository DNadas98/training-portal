package net.dnadas.training_portal.exception.utils.datetime;

public class InvalidDateTimeReceivedException extends DateTimeBadRequestException {
  public InvalidDateTimeReceivedException() {
    super("The received date-time format is invalid");
  }
}
