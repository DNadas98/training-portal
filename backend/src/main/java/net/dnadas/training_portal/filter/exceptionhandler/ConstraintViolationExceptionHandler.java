package net.dnadas.training_portal.filter.exceptionhandler;

import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
@RequiredArgsConstructor
public class ConstraintViolationExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final MessageSource messageSource;

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<?> handleDuplicateFields(ConstraintViolationException e, Locale locale) {
    logger.error(e.getMessage());
    if (e.getMessage().contains("unique constraint")) {
      String errorMessage = getConstraintErrorMessage(e.getMessage(),locale);
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", errorMessage));
    }
    throw e;
  }

  /**
   * Use this to customize error messages for any constraint violation<br/>
   *
   * @return A custom error message based on the related data field
   */
  private String getConstraintErrorMessage(String errorMessage, Locale locale) {
    Pattern pattern = Pattern.compile("Detail: Key \\((.*?)\\)=\\((.*?)\\)");

    Matcher matcher = pattern.matcher(errorMessage);
    if (matcher.find()) {
      String keyName = matcher.group(1);
      String keyValue = matcher.group(2);
      return messageSource.getMessage("error.constraint_violation", new Object[]{keyName, keyValue}, locale);
    }
    return messageSource.getMessage("error.constraint_violation.default", new Object[]{}, locale);
  }
}
