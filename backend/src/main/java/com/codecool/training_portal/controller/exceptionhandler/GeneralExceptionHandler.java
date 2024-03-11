package com.codecool.training_portal.controller.exceptionhandler;

import com.codecool.training_portal.exception.auth.InvalidCredentialsException;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.auth.UserAlreadyExistsException;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.group.DuplicateGroupJoinRequestException;
import com.codecool.training_portal.exception.group.GroupJoinRequestNotFoundException;
import com.codecool.training_portal.exception.group.GroupNotFoundException;
import com.codecool.training_portal.exception.group.UserAlreadyInGroupException;
import com.codecool.training_portal.exception.group.project.DuplicateProjectJoinRequestException;
import com.codecool.training_portal.exception.group.project.ProjectJoinRequestNotFoundException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.group.project.UserAlreadyInProjectException;
import com.codecool.training_portal.exception.group.project.task.TaskNotFoundException;
import com.codecool.training_portal.exception.group.project.task.expense.ExpenseNotFoundException;
import com.codecool.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
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

    @ExceptionHandler(UserAlreadyInGroupException.class)
    public ResponseEntity<?> handleUserAlreadyInGroup(UserAlreadyInGroupException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            Map.of("error", "User is already member of the requested group"));
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

  // 404

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UserNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", "Application user was not found"));
  }

    @ExceptionHandler(GroupNotFoundException.class)
    public ResponseEntity<?> handleGroupNotFound(GroupNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            Map.of("error", "The requested group was not found"));
  }

    @ExceptionHandler(GroupJoinRequestNotFoundException.class)
    public ResponseEntity<?> handleGroupJoinRequestNotFound(GroupJoinRequestNotFoundException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            Map.of("error", "UserGroup join request with the provided details was not found"));
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

    @ExceptionHandler(DuplicateGroupJoinRequestException.class)
    public ResponseEntity<?> handleDuplicateGroupJoinRequest(
            DuplicateGroupJoinRequestException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
            Map.of("error", "UserGroup join request already exists with the provided details"));
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

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<?> handleUserAlreadyExistsException(
    UserAlreadyExistsException e) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", "User account with the provided details already exists"));
  }
}
