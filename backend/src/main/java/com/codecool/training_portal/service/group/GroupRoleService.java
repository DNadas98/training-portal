package com.codecool.training_portal.service.group;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.group.GroupNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.service.auth.CustomPermissionEvaluator;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.UserConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GroupRoleService {
  private final UserGroupDao userGroupDao;
  private final ApplicationUserDao applicationUserDao;
  private final UserConverter userConverter;
  private final UserProvider userProvider;
  private final CustomPermissionEvaluator permissionEvaluator;

  @Transactional(readOnly = true)
  public Set<PermissionType> getUserPermissionsForGroup(Long groupId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));

    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      return Set.of(PermissionType.GROUP_MEMBER, PermissionType.GROUP_EDITOR,
        PermissionType.GROUP_ADMIN);
    }

    Set<PermissionType> permissions = new HashSet<>();
    permissions.add(PermissionType.GROUP_MEMBER);
    if (permissionEvaluator.hasGroupEditorAccess(user.getId(), userGroup)) {
      permissions.add(PermissionType.GROUP_EDITOR);
    }
    if (permissionEvaluator.hasGroupAdminAccess(user.getId(), userGroup)) {
      permissions.add(PermissionType.GROUP_ADMIN);
    }
    return permissions;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public List<UserResponsePublicDto> getMembers(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return userConverter.toUserResponsePublicDtos(userGroup.getMembers().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void addMember(Long groupId, String username) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findByUsername(username).orElseThrow(
      () -> new UserNotFoundException());
    userGroup.addMember(applicationUser);
    userGroupDao.save(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void removeMember(Long groupId, Long userId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    userGroup.removeMember(applicationUser);
    userGroupDao.save(userGroup);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public List<UserResponsePublicDto> getEditors(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return userConverter.toUserResponsePublicDtos(userGroup.getEditors().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void addEditor(Long groupId, Long userId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    userGroup.addEditor(applicationUser);
    userGroupDao.save(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void removeEditor(Long groupId, Long userId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    userGroup.removeEditor(applicationUser);
    userGroupDao.save(userGroup);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public List<UserResponsePublicDto> getAdmins(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    return userConverter.toUserResponsePublicDtos(userGroup.getAdmins().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void addAdmin(Long groupId, Long userId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    userGroup.addAdmin(applicationUser);
    userGroupDao.save(userGroup);
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public void removeAdmin(Long groupId, Long userId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    userGroup.removeAdmin(applicationUser);
    userGroupDao.save(userGroup);
  }
}
