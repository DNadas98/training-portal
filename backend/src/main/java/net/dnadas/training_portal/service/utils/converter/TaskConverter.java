package net.dnadas.training_portal.service.utils.converter;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.task.TaskResponsePublicDto;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.service.utils.datetime.DateTimeService;
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
    return tasks.stream().map(this::getTaskResponsePublicDto).collect(Collectors.toList());
  }
}
