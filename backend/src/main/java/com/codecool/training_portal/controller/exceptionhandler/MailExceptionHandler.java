package com.codecool.training_portal.controller.exceptionhandler;

import jakarta.mail.Address;
import jakarta.mail.SendFailedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailSendException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class MailExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @ExceptionHandler({MailSendException.class})
  public ResponseEntity<?> handleMailSendException(MailSendException e) {
    Exception[] exceptions = e.getMessageExceptions();
    List<String> invalidAddressesList = new ArrayList<>();
    List<String> validUnsentAddressesList = new ArrayList<>();
    List<String> validSentAddressesList = new ArrayList<>();

    for (Exception ex : exceptions) {
      if (ex instanceof SendFailedException) {
        handleSendFailureException((SendFailedException) ex, invalidAddressesList,
          validUnsentAddressesList, validSentAddressesList);
      }
    }

    Map<String, Object> errorDetails = getErrorDetails(
      invalidAddressesList, validUnsentAddressesList, validSentAddressesList);

    logger.error("E-mail sending error details: {}", errorDetails);
    if (!invalidAddressesList.isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
        "error", "Invalid e-mail address(es) received: " + invalidAddressesList.stream().collect(
          Collectors.joining(", "))
      ));
    }
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
      Map.of("error", errorDetails.get("message")));
  }

  private void handleSendFailureException(
    SendFailedException ex, List<String> invalidAddressesList,
    List<String> validUnsentAddressesList, List<String> validSentAddressesList) {
    Address[] invalidAddresses = ex.getInvalidAddresses();
    Address[] validUnsentAddresses = ex.getValidUnsentAddresses();
    Address[] validSentAddresses = ex.getValidSentAddresses();

    if (invalidAddresses != null && invalidAddresses.length > 0) {
      collectAddresses(invalidAddressesList, invalidAddresses);
    }
    if (validUnsentAddresses != null && validUnsentAddresses.length > 0) {
      collectAddresses(validUnsentAddressesList, validUnsentAddresses);
    }
    if (validSentAddresses != null && validSentAddresses.length > 0) {
      collectAddresses(validSentAddressesList, validSentAddresses);
    }
  }

  private Map<String, Object> getErrorDetails(
    List<String> invalidAddressesList, List<String> validUnsentAddressesList,
    List<String> validSentAddressesList) {
    Map<String, Object> errorDetails = new HashMap<>();
    errorDetails.put("message", "An error occurred during the e-mail sending process");
    if (!invalidAddressesList.isEmpty()) {
      errorDetails.put("invalidAddresses", invalidAddressesList);
    }
    if (!validUnsentAddressesList.isEmpty()) {
      errorDetails.put("validUnsentAddresses", validUnsentAddressesList);
    }
    if (!validSentAddressesList.isEmpty()) {
      errorDetails.put("validSentAddresses", validSentAddressesList);
    }
    return errorDetails;
  }

  private void collectAddresses(
    List<String> invalidAddressesList, Address[] invalidAddresses) {
    invalidAddressesList.addAll(Arrays.stream(invalidAddresses).map(Address::toString)
      .collect(Collectors.toList()));
  }
}
