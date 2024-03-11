package com.codecool.tasx.service.datetime;

import com.codecool.tasx.exception.datetime.*;
import com.codecool.tasx.model.company.project.task.Task;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Set;

@Service
@Slf4j
public class DateTimeService {
  public Instant toStoredDate(String zonedDateTimeString) {
    try {
      ZonedDateTime zdt = ZonedDateTime.parse(zonedDateTimeString, DateTimeFormatter.ISO_DATE_TIME);
      Instant instant = zdt.toInstant();
      log.debug("received time string: " + zonedDateTimeString + " storing Instant: " + instant);
      return instant;
    } catch (Exception e) {
      throw new InvalidDateTimeReceivedException();
    }
  }

  public String toDisplayedDate(Instant storedDate) {
    ZonedDateTime zonedDateTime = storedDate.atZone(ZoneId.of("UTC"));
    String formattedDateTime = zonedDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    log.debug("retrieved Instant: " + storedDate + " returning UTC ZonedDateTime String: " +
      formattedDateTime);
    return formattedDateTime;
  }

  public void validateTaskDates(
    Instant taskStartDate, Instant taskDeadline, Instant projectStartDate,
    Instant projectDeadline) {
    if (taskStartDate.isAfter(taskDeadline)) {
      throw new StartAfterDeadlineException();
    }
    if (taskStartDate.isBefore(projectStartDate)) {
      throw new TaskStartBeforeProjectStartException();
    }
    if (taskDeadline.isAfter(projectDeadline)) {
      throw new TaskDeadlineAfterProjectDeadlineException();
    }
  }

  public void validateProjectDates(
    Instant projectStartDate, Instant projectDeadline) throws StartAfterDeadlineException {
    if (projectStartDate.isAfter(projectDeadline)) {
      throw new StartAfterDeadlineException();
    }
  }

  public void validateProjectDates(
    Instant projectStartDate, Instant projectDeadline, Instant earliestTaskStartDate,
    Instant latestTaskDeadline)
    throws StartAfterDeadlineException, ProjectStartAfterEarliestTaskStartException,
    ProjectDeadlineBeforeLatestTaskDeadlineException {
    validateProjectDates(projectStartDate, projectDeadline);
    if (projectStartDate.isAfter(earliestTaskStartDate)) {
      throw new ProjectStartAfterEarliestTaskStartException();
    }
    if (projectDeadline.isBefore(latestTaskDeadline)) {
      throw new ProjectDeadlineBeforeLatestTaskDeadlineException();
    }
  }

  public Instant getEarliestTaskStartDate(Set<Task> tasks) throws IllegalArgumentException {
    if (tasks.isEmpty()) {
      throw new IllegalArgumentException();
    }
    return tasks.stream().min((task1, task2) -> {
      Instant startDate1 = task1.getStartDate();
      Instant startDate2 = task2.getStartDate();
      if (startDate1.isBefore(startDate2)) {
        return 1;
      } else if (startDate1.isAfter(startDate2)) {
        return -1;
      }
      return 0;
    }).get().getStartDate();
  }

  public Instant getLatestTaskDeadline(Set<Task> tasks) throws IllegalArgumentException {
    if (tasks.isEmpty()) {
      throw new IllegalArgumentException();
    }
    return tasks.stream().max((task1, task2) -> {
      Instant deadline1 = task1.getDeadline();
      Instant deadline2 = task2.getDeadline();
      if (deadline1.isAfter(deadline2)) {
        return 1;
      } else if (deadline1.isBefore(deadline2)) {
        return -1;
      }
      return 0;
    }).get().getStartDate();
  }
}
