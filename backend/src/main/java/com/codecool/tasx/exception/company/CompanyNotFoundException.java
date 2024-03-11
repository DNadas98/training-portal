package com.codecool.tasx.exception.company;

public class CompanyNotFoundException extends RuntimeException {
  private final Long id;

  public CompanyNotFoundException(Long id) {
    super("Company with ID " + id + " was not found");
    this.id = id;
  }

  public Long getId() {
    return id;
  }
}
