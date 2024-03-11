package com.codecool.training_portal.service.company.project;

import com.codecool.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import com.codecool.training_portal.dto.requests.ProjectJoinRequestUpdateDto;
import com.codecool.training_portal.exception.company.project.DuplicateProjectJoinRequestException;
import com.codecool.training_portal.exception.company.project.ProjectJoinRequestNotFoundException;
import com.codecool.training_portal.exception.company.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.company.project.UserAlreadyInProjectException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.company.project.Project;
import com.codecool.training_portal.model.company.project.ProjectDao;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import com.codecool.training_portal.model.request.ProjectJoinRequestDao;
import com.codecool.training_portal.model.request.RequestStatus;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.ProjectConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectRequestService {
  private final ProjectDao projectDao;
  private final ProjectJoinRequestDao requestDao;
  private final ProjectRoleService projectRoleService;
  private final UserProvider userProvider;
  private final ProjectConverter projectConverter;

  public List<ProjectJoinRequestResponseDto> getOwnJoinRequests() {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    List<ProjectJoinRequest> requests = requestDao.findByApplicationUser(applicationUser);
    return projectConverter.getProjectJoinRequestResponseDtos(requests);
  }

  @Transactional(rollbackFor = Exception.class)
  public ProjectJoinRequestResponseDto createJoinRequest(Long companyId, Long projectId) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    if (project.getAssignedEmployees().contains(applicationUser)) {
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
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public List<ProjectJoinRequestResponseDto> getJoinRequestsOfProject(
    Long companyId, Long projectId) {
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    List<ProjectJoinRequest> requests = requestDao.findByProjectAndStatus(
      project,
      RequestStatus.PENDING);
    return projectConverter.getProjectJoinRequestResponseDtos(requests);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public void handleJoinRequest(
    Long companyId, Long projectId, Long requestId, ProjectJoinRequestUpdateDto updateDto) {
    ProjectJoinRequest request = requestDao.findByCompanyIdAndProjectIdAndRequestId(
      companyId, projectId, requestId).orElseThrow(
      () -> new ProjectJoinRequestNotFoundException(requestId));
    request.setStatus(updateDto.status());
    if (request.getStatus().equals(RequestStatus.APPROVED)) {
      projectRoleService.assignEmployee(companyId, projectId, request.getApplicationUser().getId());
      requestDao.delete(request);
    }
  }
}
