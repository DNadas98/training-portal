package com.codecool.tasx.exception.verification;

public class VerificationTokenAlreadyExistsException extends RuntimeException {
  public VerificationTokenAlreadyExistsException() {
    super("Verification process with the provided details is already started");
  }
}
