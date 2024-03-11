package com.codecool.training_portal.exception.datetime;

public abstract class DateTimeBadRequestException extends RuntimeException {
  protected DateTimeBadRequestException(String message) {
    super(message);
  }
}
