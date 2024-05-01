package net.dnadas.training_portal.exception.user;

public abstract class InvalidExpirationDateException extends RuntimeException {
  public InvalidExpirationDateException(String message) {
    super(message);
  }
}
