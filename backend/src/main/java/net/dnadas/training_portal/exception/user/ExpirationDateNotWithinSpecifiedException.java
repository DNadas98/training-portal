package net.dnadas.training_portal.exception.user;

public class ExpirationDateNotWithinSpecifiedException
  extends InvalidExpirationDateException {
  public ExpirationDateNotWithinSpecifiedException() {
    super("Expiration date must be within a year");
  }
}
