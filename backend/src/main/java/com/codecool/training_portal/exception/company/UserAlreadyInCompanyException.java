package com.codecool.training_portal.exception.company;

public class UserAlreadyInCompanyException extends RuntimeException {
  public UserAlreadyInCompanyException() {
    super("User is already employee of the company");
  }
}
