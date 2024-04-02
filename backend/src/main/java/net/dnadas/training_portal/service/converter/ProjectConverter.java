package net.dnadas.training_portal.service.converter;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.ProjectResponsePrivateDTO;
import net.dnadas.training_portal.dto.group.project.ProjectResponsePublicDTO;
import net.dnadas.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.request.ProjectJoinRequest;
import net.dnadas.training_portal.service.datetime.DateTimeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectConverter {
  private final UserConverter userConverter;
  private final TaskConverter taskConverter;
  private final DateTimeService dateTimeService;

  public ProjectResponsePublicDTO getProjectResponsePublicDto(Project project) {
    return new ProjectResponsePublicDTO(project.getUserGroup().getId(), project.getId(),
      project.getName(), project.getDescription(),
      dateTimeService.toDisplayedDate(project.getStartDate()),
      dateTimeService.toDisplayedDate(project.getDeadline()));
  }

  public ProjectResponsePrivateDTO getProjectResponsePrivateDto(Project project) {
    return new ProjectResponsePrivateDTO(project.getUserGroup().getId(), project.getId(),
      project.getName(), project.getDescription(), project.getDetailedDescription(),
      dateTimeService.toDisplayedDate(project.getStartDate()),
      dateTimeService.toDisplayedDate(project.getDeadline()),
      taskConverter.getTaskResponsePublicDtos(project.getTasks().stream().toList()));
  }

  public List<ProjectResponsePublicDTO> getProjectResponsePublicDtos(List<Project> projects) {
    return projects.stream().map(
      this::getProjectResponsePublicDto).collect(Collectors.toList());
  }

  public ProjectJoinRequestResponseDto getProjectJoinRequestResponseDto(
    ProjectJoinRequest request) {
    return new ProjectJoinRequestResponseDto(request.getId(),
      getProjectResponsePublicDto(request.getProject()),
      userConverter.toUserResponsePublicDto(request.getApplicationUser()), request.getStatus());
  }

  public List<ProjectJoinRequestResponseDto> getProjectJoinRequestResponseDtos(
    List<ProjectJoinRequest> requests) {
    return requests.stream().map(this::getProjectJoinRequestResponseDto).collect(
      Collectors.toList());
  }
}
