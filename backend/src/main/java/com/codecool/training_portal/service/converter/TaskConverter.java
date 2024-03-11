package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.task.TaskResponsePublicDto;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.service.datetime.DateTimeService;
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
