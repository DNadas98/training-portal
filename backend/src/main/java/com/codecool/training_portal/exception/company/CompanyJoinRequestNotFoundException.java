package com.codecool.training_portal.exception.company;

public class CompanyJoinRequestNotFoundException extends RuntimeException {
  private final Long id;

  public CompanyJoinRequestNotFoundException(Long id) {
    super("Company join request with ID " + id + " was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
