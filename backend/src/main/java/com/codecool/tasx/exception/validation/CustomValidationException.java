package com.codecool.tasx.exception.validation;

import org.springframework.validation.FieldError;

import java.util.List;
import java.util.stream.Collectors;

public class CustomValidationException extends RuntimeException {
  private final List<FieldError> fieldErrors;

  public CustomValidationException(List<FieldError> fieldErrors) {
    this.fieldErrors = fieldErrors;
  }

  public List<FieldError> getFieldErrors() {
    return List.copyOf(fieldErrors);
  }

  @Override
  public String getMessage() {
    return this.fieldErrors.stream().map(
      fieldError -> String.format("Field '%s' %s", fieldError.getField(),
        fieldError.getDefaultMessage())).collect(Collectors.joining(", "));
  }
}
