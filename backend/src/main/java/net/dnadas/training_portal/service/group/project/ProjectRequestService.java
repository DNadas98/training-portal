package net.dnadas.training_portal.service.group.project;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import net.dnadas.training_portal.dto.requests.ProjectJoinRequestUpdateDto;
import net.dnadas.training_portal.exception.group.project.DuplicateProjectJoinRequestException;
import net.dnadas.training_portal.exception.group.project.ProjectJoinRequestNotFoundException;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.exception.group.project.UserAlreadyInProjectException;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.request.ProjectJoinRequest;
import net.dnadas.training_portal.model.request.ProjectJoinRequestDao;
import net.dnadas.training_portal.model.request.RequestStatus;
import net.dnadas.training_portal.service.user.UserProvider;
import net.dnadas.training_portal.service.utils.converter.ProjectConverter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectRequestService {
  private final ProjectDao projectDao;
  private final ProjectJoinRequestDao requestDao;
  private final ProjectAdminService projectAdminService;
  private final UserProvider userProvider;
  private final ProjectConverter projectConverter;

  public List<ProjectJoinRequestResponseDto> getOwnJoinRequests() {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    List<ProjectJoinRequest> requests = requestDao.findByApplicationUser(applicationUser);
    return projectConverter.getProjectJoinRequestResponseDtos(requests);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_MEMBER')")
  public ProjectJoinRequestResponseDto createJoinRequest(Long groupId, Long projectId) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    if (project.getAssignedMembers().contains(applicationUser)) {
      throw new UserAlreadyInProjectException();
    }
    Optional<ProjectJoinRequest> duplicateRequest = requestDao.findOneByProjectAndApplicationUser(
      project, applicationUser);
    if (duplicateRequest.isPresent()) {
      throw new DuplicateProjectJoinRequestException();
    }
    ProjectJoinRequest savedRequest = requestDao.save(
      new ProjectJoinRequest(project, applicationUser));
    return projectConverter.getProjectJoinRequestResponseDto(savedRequest);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteOwnJoinRequestById(Long requestId) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    ProjectJoinRequest joinRequest = requestDao.findByIdAndApplicationUser(
      requestId,
      applicationUser).orElseThrow(() -> new ProjectJoinRequestNotFoundException(requestId));
    requestDao.delete(joinRequest);
  }

  @Transactional
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public Page<ProjectJoinRequestResponseDto> getJoinRequestsOfProject(
    Long groupId, Long projectId, String search, Pageable pageable) {
    projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Page<ProjectJoinRequest> requests = requestDao.findByProjectAndStatus(groupId, projectId,
      RequestStatus.PENDING, search, pageable);
    return requests.map(projectConverter::getProjectJoinRequestResponseDto);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void handleJoinRequest(
    Long groupId, Long projectId, Long requestId, ProjectJoinRequestUpdateDto updateDto) {
    ProjectJoinRequest request = requestDao.findByGroupIdAndProjectIdAndRequestId(
      groupId, projectId, requestId).orElseThrow(
      () -> new ProjectJoinRequestNotFoundException(requestId));
    request.setStatus(updateDto.status());
    request.setUpdatedAt(Instant.now());
    if (request.getStatus().equals(RequestStatus.APPROVED)) {
      projectAdminService.assignMember(
        groupId, projectId, request.getApplicationUser().getActualUsername());
      requestDao.delete(request);
    } else {
      requestDao.save(request);
    }
  }
}
