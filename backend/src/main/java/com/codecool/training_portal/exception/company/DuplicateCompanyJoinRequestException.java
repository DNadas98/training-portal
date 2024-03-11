package com.codecool.training_portal.exception.company;

public class DuplicateCompanyJoinRequestException extends RuntimeException {
  public DuplicateCompanyJoinRequestException() {
    super("Company join request already exists");
  }
}
