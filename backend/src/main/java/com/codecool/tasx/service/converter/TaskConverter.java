package com.codecool.tasx.service.converter;

import com.codecool.tasx.dto.company.project.task.TaskResponsePublicDto;
import com.codecool.tasx.model.company.project.task.Task;
import com.codecool.tasx.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskConverter {
  private final DateTimeService dateTimeService;

  public TaskResponsePublicDto getTaskResponsePublicDto(Task task) {
    return new TaskResponsePublicDto(task.getProject().getId(),
      task.getId(), task.getName(), task.getDescription(), task.getImportance(),
      task.getDifficulty(), dateTimeService.toDisplayedDate(task.getStartDate()),
      dateTimeService.toDisplayedDate(task.getDeadline()), task.getTaskStatus());
  }

  public List<TaskResponsePublicDto> getTaskResponsePublicDtos(List<Task> tasks) {
    return tasks.stream().map(task -> getTaskResponsePublicDto(task)).collect(Collectors.toList());
  }
}
