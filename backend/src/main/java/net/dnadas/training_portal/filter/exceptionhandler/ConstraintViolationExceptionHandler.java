package net.dnadas.training_portal.filter.exceptionhandler;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
public class ConstraintViolationExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<?> handleDuplicateFields(ConstraintViolationException e) {
    logger.error(e.getMessage());
    if (e.getMessage().contains("unique constraint")) {
      String errorMessage = getConstraintErrorMessage(e.getMessage());
      return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", errorMessage));
    }
    throw e;
  }

  /**
   * Use this to customize error messages for any constraint violation<br/>
   *
   * @return A custom error message based on the related data field
   */
  private String getConstraintErrorMessage(String errorMessage) {
    Pattern pattern = Pattern.compile("Detail: Key \\((.*?)\\)=\\((.*?)\\)");

    Matcher matcher = pattern.matcher(errorMessage);
    if (matcher.find()) {
      String keyName = matcher.group(1);
      String keyValue = matcher.group(2);
      return "The requested " + keyName + ": " + keyValue + " already exists";
    }
    return "The requested update is conflicting with already existing data";
  }
}
