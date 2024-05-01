package net.dnadas.training_portal.exception.user;

public class PastDateExpirationDateException
  extends InvalidExpirationDateException {
  public PastDateExpirationDateException() {
    super("Expiration date must be in the future");
  }
}
