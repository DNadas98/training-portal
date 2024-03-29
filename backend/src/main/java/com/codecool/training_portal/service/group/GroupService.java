package com.codecool.training_portal.service.group;

import com.codecool.training_portal.dto.group.GroupCreateRequestDto;
import com.codecool.training_portal.dto.group.GroupResponsePrivateDTO;
import com.codecool.training_portal.dto.group.GroupResponsePublicDTO;
import com.codecool.training_portal.dto.group.GroupUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.group.GroupNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.model.request.RequestStatus;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.GroupConverter;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {
  private final UserGroupDao userGroupDao;
  private final GroupConverter groupConverter;
  private final UserProvider userProvider;

  @Secured("ADMIN")
  public List<GroupResponsePublicDTO> getAllGroups() throws UnauthorizedException {
    List<UserGroup> userGroup = userGroupDao.findAll();
    return groupConverter.getGroupResponsePublicDtos(userGroup);
  }

  @Transactional(readOnly = true)
  public List<GroupResponsePublicDTO> getGroupsWithoutUser() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    if (applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      return new ArrayList<>();
    }
    List<UserGroup> groups = userGroupDao.findAllWithoutMemberAndJoinRequest(
      applicationUser, List.of(RequestStatus.PENDING, RequestStatus.DECLINED));
    return groupConverter.getGroupResponsePublicDtos(groups);

  }

  @Transactional(readOnly = true)
  public List<GroupResponsePublicDTO> getGroupsWithUser() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Hibernate.initialize(applicationUser.getMemberUserGroups());
    final List<UserGroup> groups;
    if (applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      groups = userGroupDao.findAll();
    } else {
      groups = applicationUser.getMemberUserGroups();
    }
    return groupConverter.getGroupResponsePublicDtos(groups);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_MEMBER')")
  public GroupResponsePrivateDTO getGroupById(Long groupId)
    throws GroupNotFoundException, UnauthorizedException {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return groupConverter.getGroupResponsePrivateDto(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public GroupResponsePrivateDTO createGroup(
    GroupCreateRequestDto createRequestDto) throws ConstraintViolationException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    UserGroup userGroup = new UserGroup(
      createRequestDto.name(), createRequestDto.description(), applicationUser);
    userGroup.addMember(applicationUser);
    userGroupDao.save(userGroup);
    return groupConverter.getGroupResponsePrivateDto(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_EDITOR')")
  public GroupResponsePrivateDTO updateGroup(
    GroupUpdateRequestDto updateRequestDto, Long groupId) throws ConstraintViolationException {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    userGroup.setName(updateRequestDto.name());
    userGroup.setDescription(updateRequestDto.description());
    UserGroup updatedUserGroup = userGroupDao.save(userGroup);
    return groupConverter.getGroupResponsePrivateDto(updatedUserGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public void deleteGroup(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(() ->
      new GroupNotFoundException(groupId));
    userGroupDao.delete(userGroup);
  }
}
