package net.dnadas.training_portal.exception.auth;

/**
 * Only thrown <strong> when the user is already authenticated </strong> and the newPassword verification fails.
 */
public class PasswordVerificationFailedException extends RuntimeException {
  public PasswordVerificationFailedException() {
    super();
  }
}
