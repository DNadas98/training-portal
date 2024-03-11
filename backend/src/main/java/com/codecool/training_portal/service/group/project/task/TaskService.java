package com.codecool.training_portal.service.group.project.task;

import com.codecool.training_portal.dto.group.project.task.TaskCreateRequestDto;
import com.codecool.training_portal.dto.group.project.task.TaskResponsePublicDto;
import com.codecool.training_portal.dto.group.project.task.TaskUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.group.project.task.TaskNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.group.project.task.TaskDao;
import com.codecool.training_portal.model.group.project.task.TaskStatus;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.TaskConverter;
import com.codecool.training_portal.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
  private final TaskDao taskDao;
  private final ProjectDao projectDao;
  private final TaskConverter taskConverter;
  private final UserProvider userProvider;
  private final DateTimeService dateTimeService;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<TaskResponsePublicDto> getAllTasks(Long groupId, Long projectId)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    List<Task> tasks = project.getTasks().stream().toList();
    return taskConverter.getTaskResponsePublicDtos(tasks);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<TaskResponsePublicDto> getAllTasks(Long groupId, Long projectId, Boolean withUser)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<Task> tasks;
    if (withUser) {
      tasks = taskDao.findAllByProjectAndApplicationUser(project, user);
    } else {
      tasks = taskDao.findAllByProjectAndWithoutApplicationUser(project, user);
    }
    return taskConverter.getTaskResponsePublicDtos(tasks);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<TaskResponsePublicDto> getAllTasks(
          Long groupId, Long projectId, Boolean withUser, TaskStatus taskStatus)
    throws ProjectNotFoundException, UnauthorizedException {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<Task> tasks;
    if (withUser) {
      tasks = taskDao.findAllByProjectAndTaskStatusAndApplicationUser(project, taskStatus, user);
    } else {
      tasks = taskDao.findAllByProjectAndTaskStatusAndWithoutApplicationUser(project, taskStatus,
        user);
    }
    return taskConverter.getTaskResponsePublicDtos(tasks);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public TaskResponsePublicDto createTask(
          TaskCreateRequestDto createRequestDto, Long groupId, Long projectId)
    throws ConstraintViolationException {
    Instant taskStartDate = dateTimeService.toStoredDate(createRequestDto.startDate());
    Instant taskDeadline = dateTimeService.toStoredDate(createRequestDto.deadline());

      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    dateTimeService.validateTaskDates(taskStartDate, taskDeadline, project.getStartDate(),
      project.getDeadline());

    Task task = new Task(createRequestDto.name(), createRequestDto.description(),
      createRequestDto.importance(), createRequestDto.difficulty(), taskStartDate, taskDeadline,
      createRequestDto.taskStatus(), project, applicationUser);
    taskDao.save(task);
    return taskConverter.getTaskResponsePublicDto(task);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public TaskResponsePublicDto getTaskById(Long groupId, Long projectId, Long taskId)
    throws UnauthorizedException {
      Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    return taskConverter.getTaskResponsePublicDto(task);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public TaskResponsePublicDto updateTask(
          TaskUpdateRequestDto updateRequestDto, Long groupId, Long projectId, Long taskId)
    throws ConstraintViolationException {
    Instant taskStartDate = dateTimeService.toStoredDate(updateRequestDto.startDate());
    Instant taskDeadline = dateTimeService.toStoredDate(updateRequestDto.deadline());
      Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    Project project = task.getProject();
    dateTimeService.validateTaskDates(taskStartDate, taskDeadline, project.getStartDate(),
      project.getDeadline());

    updateTaskDetails(updateRequestDto, task, taskStartDate, taskDeadline);
    Task savedTask = taskDao.save(task);
    return taskConverter.getTaskResponsePublicDto(savedTask);
  }

  private void updateTaskDetails(
    TaskUpdateRequestDto updateRequestDto, Task task, Instant taskStartDate, Instant taskDeadline) {
    task.setName(updateRequestDto.name());
    task.setDescription(updateRequestDto.description());
    task.setImportance(updateRequestDto.importance());
    task.setDifficulty(updateRequestDto.difficulty());
    task.setStartDate(taskStartDate);
    task.setDeadline(taskDeadline);
    task.setTaskStatus(updateRequestDto.taskStatus());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public void deleteTask(Long groupId, Long projectId, Long taskId) {
      Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    taskDao.delete(task);
  }
}
