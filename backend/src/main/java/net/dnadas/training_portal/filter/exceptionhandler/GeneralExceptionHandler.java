package net.dnadas.training_portal.filter.exceptionhandler;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.exception.auth.*;
import net.dnadas.training_portal.exception.group.DuplicateGroupJoinRequestException;
import net.dnadas.training_portal.exception.group.GroupJoinRequestNotFoundException;
import net.dnadas.training_portal.exception.group.GroupNotFoundException;
import net.dnadas.training_portal.exception.group.UserAlreadyInGroupException;
import net.dnadas.training_portal.exception.group.project.DuplicateProjectJoinRequestException;
import net.dnadas.training_portal.exception.group.project.ProjectJoinRequestNotFoundException;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.exception.group.project.UserAlreadyInProjectException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireAlreadyActivatedException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import net.dnadas.training_portal.exception.group.project.task.TaskNotFoundException;
import net.dnadas.training_portal.exception.user.ExpirationDateNotWithinSpecifiedException;
import net.dnadas.training_portal.exception.user.PastDateExpirationDateException;
import net.dnadas.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Locale;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class GeneralExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final MessageSource messageSource;

  // 400

  @ExceptionHandler(UserAlreadyInGroupException.class)
  public ResponseEntity<?> handleUserAlreadyInGroup(UserAlreadyInGroupException e, Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", messageSource.getMessage("error.group.user_already_member", null,
        locale)));
  }

  @ExceptionHandler(UserAlreadyInProjectException.class)
  public ResponseEntity<?> handleUserAlreadyInProjectException(
    UserAlreadyInProjectException e, Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", messageSource.getMessage("error.project.user_already_member", null, locale)));
  }

  @ExceptionHandler(PastDateExpirationDateException.class)
  public ResponseEntity<?> handleInvalidExpirationDateException(
    PastDateExpirationDateException e,Locale locale) {
    String message = e.getMessage();
    logger.error(message);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", messageSource.getMessage("error.user.expiration_date.past", null, locale)));
  }

  @ExceptionHandler(ExpirationDateNotWithinSpecifiedException.class)
  public ResponseEntity<?> handleInvalidExpirationDateException(
    ExpirationDateNotWithinSpecifiedException e,Locale locale) {
    String message = e.getMessage();
    logger.error(message);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
      Map.of("error", messageSource.getMessage("error.user.expiration_date.not_within_specified", null, locale)));
  }

  // 401

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UnauthorizedException e,Locale locale) {
    logger.error(e.getMessage() == null ? "Unauthorized" : e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
      Map.of("error", messageSource.getMessage("error.auth.unauthorized", null, locale)));
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UsernameNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
      Map.of("error", messageSource.getMessage("error.auth.unauthorized", null, locale)));
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<?> handleInvalidCredentialsException(
    InvalidCredentialsException e, Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
      Map.of("error", messageSource.getMessage("error.auth.invalid_credentials", null, locale)));
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
    Map.of("error", messageSource.getMessage("error.auth.invalid_credentials", null, locale)));
  }

  // 403

  @ExceptionHandler(QuestionnaireAlreadyActivatedException.class)
  public ResponseEntity<?> handleQuestionnaireAlreadyActivatedException(
    QuestionnaireAlreadyActivatedException e, Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
      Map.of(
        "error",
        messageSource.getMessage("questionnaire.delete.forbidden.already.activated", null, locale)));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException e, Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
    Map.of("error", messageSource.getMessage("error.auth.access_denied", null, locale)));
  }

  @ExceptionHandler({PasswordVerificationFailedException.class})
  public ResponseEntity<?> handlePasswordVerificationFailedException(
    PasswordVerificationFailedException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
    Map.of("error", messageSource.getMessage("error.auth.password_incorrect", null, locale)));
  }

  // 404

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<?> handleCustomUnauthorized(UserNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.user.not_found", null, locale)));
  }

  @ExceptionHandler(GroupNotFoundException.class)
  public ResponseEntity<?> handleGroupNotFound(GroupNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.group.not_found", null,locale)));
  }

  @ExceptionHandler(GroupJoinRequestNotFoundException.class)
  public ResponseEntity<?> handleGroupJoinRequestNotFound(GroupJoinRequestNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.group.join_request.not_found", null, locale)));
  }

  @ExceptionHandler(ProjectNotFoundException.class)
  public ResponseEntity<?> handleProjectNotFound(ProjectNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.project.not_found", null, locale)));
  }

  @ExceptionHandler(ProjectJoinRequestNotFoundException.class)
  public ResponseEntity<?> handleProjectJoinRequestNotFoundException(
    ProjectJoinRequestNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.project.join_request.not_found", null, locale)));
  }

  @ExceptionHandler(TaskNotFoundException.class)
  public ResponseEntity<?> handleTaskNotFoundException(TaskNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.task.not_found", null, locale)));
  }

  @ExceptionHandler(QuestionnaireNotFoundException.class)
  public ResponseEntity<?> handleQuestionnaireNotFoundException(QuestionnaireNotFoundException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
      Map.of("error", messageSource.getMessage("error.questionnaire.not_found", null, locale)));
  }

  // 409

  @ExceptionHandler(DuplicateGroupJoinRequestException.class)
  public ResponseEntity<?> handleDuplicateGroupJoinRequest(
    DuplicateGroupJoinRequestException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", messageSource.getMessage("error.group.join_request.duplicate", null,locale)));
  }

  @ExceptionHandler(DuplicateProjectJoinRequestException.class)
  public ResponseEntity<?> handleDuplicateProjectJoinRequestException(
    DuplicateProjectJoinRequestException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", messageSource.getMessage("error.project.join_request.duplicate", null,locale)));
  }

  @ExceptionHandler(VerificationTokenAlreadyExistsException.class)
  public ResponseEntity<?> handleVerificationTokenAlreadyExistsException(
    VerificationTokenAlreadyExistsException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error",messageSource.getMessage("error.verification_token.duplicate", null, locale)));
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<?> handleUserAlreadyExistsException(
    UserAlreadyExistsException e,Locale locale) {
    logger.error(e.getMessage());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
      Map.of("error", messageSource.getMessage("error.user.duplicate", null, locale)));
  }

  // Avoid Spring Boot default error pages, send empty 500 error
  @ExceptionHandler(Throwable.class)
  public ResponseEntity<?> handleUnexpectedException(
    Throwable e,Locale locale) {
    logger.error("Unhandled exception: ", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
  }
}
