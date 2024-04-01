package net.dnadas.training_portal.service.group;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.requests.GroupJoinRequestResponseDto;
import net.dnadas.training_portal.dto.requests.GroupJoinRequestUpdateDto;
import net.dnadas.training_portal.exception.group.DuplicateGroupJoinRequestException;
import net.dnadas.training_portal.exception.group.GroupJoinRequestNotFoundException;
import net.dnadas.training_portal.exception.group.GroupNotFoundException;
import net.dnadas.training_portal.exception.group.UserAlreadyInGroupException;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.request.RequestStatus;
import net.dnadas.training_portal.model.request.UserGroupJoinRequest;
import net.dnadas.training_portal.model.request.UserGroupJoinRequestDao;
import net.dnadas.training_portal.service.auth.UserProvider;
import net.dnadas.training_portal.service.converter.GroupConverter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupRequestService {
  private final UserGroupDao userGroupDao;
  private final UserGroupJoinRequestDao requestDao;
  private final GroupRoleService groupRoleService;
  private final UserProvider userProvider;
  private final GroupConverter groupConverter;

  public List<GroupJoinRequestResponseDto> getOwnJoinRequests() {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    List<UserGroupJoinRequest> requests = requestDao.findByApplicationUser(applicationUser);
    return groupConverter.getGroupJoinRequestResponseDtos(requests);
  }

  @Transactional(rollbackFor = Exception.class)
  public GroupJoinRequestResponseDto createJoinRequest(Long groupId) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    if (userGroup.getMembers().contains(applicationUser)) {
      throw new UserAlreadyInGroupException();
    }
    Optional<UserGroupJoinRequest> duplicateRequest =
      requestDao.findOneByUserGroupAndApplicationUser(
        userGroup, applicationUser);
    if (duplicateRequest.isPresent()) {
      throw new DuplicateGroupJoinRequestException();
    }
    UserGroupJoinRequest joinRequest = new UserGroupJoinRequest(userGroup, applicationUser);
    UserGroupJoinRequest savedRequest = requestDao.save(joinRequest);
    return groupConverter.getGroupJoinRequestResponseDto(savedRequest);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteOwnJoinRequestById(Long requestId) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    UserGroupJoinRequest joinRequest = requestDao.findByIdAndApplicationUser(
      requestId,
      applicationUser).orElseThrow(() -> new GroupJoinRequestNotFoundException(requestId));
    requestDao.deleteById(joinRequest.getId());
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public List<GroupJoinRequestResponseDto> getJoinRequestsOfGroup(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    List<UserGroupJoinRequest> requests = requestDao.findByUserGroupAndStatus(
      userGroup,
      RequestStatus.PENDING);
    return groupConverter.getGroupJoinRequestResponseDtos(requests);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void handleJoinRequest(
    Long groupId, Long requestId, GroupJoinRequestUpdateDto updateDto) {
    UserGroupJoinRequest request = requestDao.findByIdAndGroupId(requestId, groupId).orElseThrow(
      () -> new GroupJoinRequestNotFoundException(requestId));
    request.setStatus(updateDto.status());
    request.setUpdatedAt(Instant.now());
    if (request.getStatus().equals(RequestStatus.APPROVED)) {
      groupRoleService.addMember(groupId, request.getApplicationUser().getActualUsername());
      requestDao.delete(request);
    } else {
      requestDao.save(request);
    }
  }
}
