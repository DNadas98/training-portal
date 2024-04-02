package net.dnadas.training_portal.exception.auth;

public class UserAlreadyExistsException extends RuntimeException {
  public UserAlreadyExistsException() {
    super("User account with the provided details already exists.");
  }

  /**
   * Constructs a new runtime exception with the specified detail message.
   * The cause is not initialized, and may subsequently be initialized by a
   * call to {@link #initCause}.
   *
   * @param message the detail message. The detail message is saved for
   *                later retrieval by the {@link #getMessage()} method.
   */
  public UserAlreadyExistsException(String message) {
    super(message);
  }
}
