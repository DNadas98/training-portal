package net.dnadas.training_portal.exception.utils.datetime;

public abstract class DateTimeBadRequestException extends RuntimeException {
  protected DateTimeBadRequestException(String message) {
    super(message);
  }
}
