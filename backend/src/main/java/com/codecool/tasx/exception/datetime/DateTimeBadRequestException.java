package com.codecool.tasx.exception.datetime;

public abstract class DateTimeBadRequestException extends RuntimeException {
  protected DateTimeBadRequestException(String message) {
    super(message);
  }
}
