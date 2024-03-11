package com.codecool.tasx.controller.exceptionhandler;

import com.codecool.tasx.exception.auth.*;
import com.codecool.tasx.exception.company.CompanyJoinRequestNotFoundException;
import com.codecool.tasx.exception.company.CompanyNotFoundException;
import com.codecool.tasx.exception.company.DuplicateCompanyJoinRequestException;
import com.codecool.tasx.exception.company.UserAlreadyInCompanyException;
import com.codecool.tasx.exception.company.project.DuplicateProjectJoinRequestException;
import com.codecool.tasx.exception.company.project.ProjectJoinRequestNotFoundException;
import com.codecool.tasx.exception.company.project.ProjectNotFoundException;
import com.codecool.tasx.exception.company.project.UserAlreadyInProjectException;
import com.codecool.tasx.exception.company.project.task.TaskNotFoundException;
import com.codecool.tasx.exception.company.project.task.expense.ExpenseNotFoundException;
import com.codecool.tasx.exception.user.UserNotFoundException;
import com.codecool.tasx.exception.verification.VerificationTokenAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GeneralExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  // 400

  @ExceptionHandler(UserAlreadyInCompanyException.class)
  public ResponseEntity<?> handleUserAlreadyInCompany(UserAlreadyInCompanyException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", "User is already employee of the requested company"));
  }

  @ExceptionHandler(UserAlreadyInProjectException.class)
  public ResponseEntity<?> handleUserAlreadyInProjectException(UserAlreadyInProjectException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", "User is already assigned to the requested project"));
  }


  // 401

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UnauthorizedException e) {
    logger.error(e.getMessage() == null ? "Unauthorized" : e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UsernameNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<?> handleInvalidCredentialsException(InvalidCredentialsException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
      Map.of("error", "The provided credentials are invalid"));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
      Map.of("error", "The provided credentials are invalid"));
  }

  // 403

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
      Map.of("error", "Access Denied: Insufficient permissions"));
  }

  @ExceptionHandler(AccountLinkingRequiredException.class)
  public ResponseEntity<?> handleAccountLinkingRequired(AccountLinkingRequiredException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
      "error",
      "User account with the provided credentials address already exists. Account linking is required to proceed"));
  }

  @ExceptionHandler(OnlyOneAccountFoundException.class)
  public ResponseEntity<?> handleOnlyOneAccountFoundException(OnlyOneAccountFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
      "error",
      "The last remaining user account must be deleted by deleting the application user"));
  }

  // 404

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UserNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "Application user was not found"));
  }

  @ExceptionHandler(AccountNotFound.class)
  public ResponseEntity<?> handleAccountNotFound(AccountNotFound e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "User account was not found"));
  }

  @ExceptionHandler(CompanyNotFoundException.class)
  public ResponseEntity<?> handleCompanyNotFound(CompanyNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "The requested company was not found"));
  }

  @ExceptionHandler(CompanyJoinRequestNotFoundException.class)
  public ResponseEntity<?> handleCompanyJoinRequestNotFound(CompanyJoinRequestNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "Company join request with the provided details was not found"));
  }

  @ExceptionHandler(ProjectNotFoundException.class)
  public ResponseEntity<?> handleProjectNotFound(ProjectNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "The requested project was not found"));
  }

  @ExceptionHandler(ProjectJoinRequestNotFoundException.class)
  public ResponseEntity<?> handleProjectJoinRequestNotFoundException(
    ProjectJoinRequestNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "Project join request with the provided details was not found"));
  }

  @ExceptionHandler(TaskNotFoundException.class)
  public ResponseEntity<?> handleTaskNotFoundException(TaskNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "The requested task was not found"));
  }

  @ExceptionHandler(ExpenseNotFoundException.class)
  public ResponseEntity<?> handleExpenseNotFoundException(ExpenseNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "The requested expense was not found"));
  }

  // 409

  @ExceptionHandler(AccountAlreadyExistsException.class)
  public ResponseEntity<?> handleAlreadyExistingAccount(AccountAlreadyExistsException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", "User account with the provided e-mail address already exists"));
  }

  @ExceptionHandler(DuplicateCompanyJoinRequestException.class)
  public ResponseEntity<?> handleDuplicateCompanyJoinRequest(
    DuplicateCompanyJoinRequestException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", "Company join request already exists with the provided details"));
  }

  @ExceptionHandler(DuplicateProjectJoinRequestException.class)
  public ResponseEntity<?> handleDuplicateProjectJoinRequestException(
    DuplicateProjectJoinRequestException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", "Project join request already exists with the provided details"));
  }

  @ExceptionHandler(VerificationTokenAlreadyExistsException.class)
  public ResponseEntity<?> handleVerificationTokenAlreadyExistsException(
    VerificationTokenAlreadyExistsException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", "Verification process with the provided details is already started"));
  }

  // 500

  @ExceptionHandler(OAuth2ProcessingException.class)
  public ResponseEntity<?> handleOAuth2ProcessingException(OAuth2ProcessingException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
      Map.of("error", "An error occurred while processing the authentication request"));
  }
}
