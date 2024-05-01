package net.dnadas.training_portal.filter.exceptionhandler;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@RequiredArgsConstructor
public class ValidationExceptionHandler {
  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final MessageSource messageSource;

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<?> handleValidationException(MethodArgumentNotValidException e, Locale locale) {
    logger.error(e.getMessage());
    try {
      String errorMessage = e.getBindingResult().getFieldErrors().stream().map(
        fieldError -> String.format("'%s' %s", fieldError.getField(),
          fieldError.getDefaultMessage())).collect(Collectors.joining("; "));
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", errorMessage));
    } catch (Exception ex) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
        Map.of("error", messageSource.getMessage("error.invalid_input.default", null, locale)));
    }
  }
}
