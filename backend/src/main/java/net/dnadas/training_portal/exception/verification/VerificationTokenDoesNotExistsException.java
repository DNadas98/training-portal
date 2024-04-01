package net.dnadas.training_portal.exception.verification;

public class VerificationTokenDoesNotExistsException extends RuntimeException {
  public VerificationTokenDoesNotExistsException() {
    super("Verification token with the provided details does not exist");
  }
}
