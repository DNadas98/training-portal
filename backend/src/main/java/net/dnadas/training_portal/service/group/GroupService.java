package net.dnadas.training_portal.service.group;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.GroupCreateRequestDto;
import net.dnadas.training_portal.dto.group.GroupResponsePrivateDTO;
import net.dnadas.training_portal.dto.group.GroupResponsePublicDTO;
import net.dnadas.training_portal.dto.group.GroupUpdateRequestDto;
import net.dnadas.training_portal.exception.auth.UnauthorizedException;
import net.dnadas.training_portal.exception.group.GroupNotFoundException;
import net.dnadas.training_portal.model.auth.GlobalRole;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.request.RequestStatus;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.service.user.UserProvider;
import net.dnadas.training_portal.service.utils.converter.GroupConverter;
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
  public GroupResponsePrivateDTO getGroupDetailsById(Long groupId)
    throws GroupNotFoundException, UnauthorizedException {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return groupConverter.getGroupResponsePrivateDto(userGroup);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_MEMBER')")
  public GroupResponsePublicDTO getGroupById(Long groupId)
    throws GroupNotFoundException, UnauthorizedException {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return groupConverter.getGroupResponsePublicDto(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public GroupResponsePrivateDTO createGroup(
    GroupCreateRequestDto createRequestDto) throws ConstraintViolationException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    String detailedDescription = createRequestDto.detailedDescription();
    //TODO: sanitize detailedDescription HTML
    UserGroup userGroup = new UserGroup(
      createRequestDto.name(), createRequestDto.description(), detailedDescription,
      applicationUser);
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
    String detailedDescription = updateRequestDto.detailedDescription();
    //TODO: sanitize detailedDescription HTML
    userGroup.setDetailedDescription(detailedDescription);
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
