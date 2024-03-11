package com.codecool.tasx.controller.exceptionhandler;

import com.codecool.tasx.exception.datetime.DateTimeBadRequestException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
public class DateTimeExceptionHandler {
  Logger logger = LoggerFactory.getLogger(this.getClass());

  @ExceptionHandler(DateTimeBadRequestException.class)
  public ResponseEntity<?> handleDateTimeException(DateTimeBadRequestException e) {
    logger.error("DateTimeBadRequestException - " + e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
  }
}
