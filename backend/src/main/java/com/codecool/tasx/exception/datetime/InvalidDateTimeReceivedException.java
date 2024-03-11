package com.codecool.tasx.exception.datetime;

public class InvalidDateTimeReceivedException extends DateTimeBadRequestException {
  public InvalidDateTimeReceivedException() {
    super("The received date-time format is invalid");
  }
}
