package net.dnadas.training_portal.service.utils.converter;

import net.dnadas.training_portal.dto.user.UserResponsePrivateDto;
import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.dto.user.UserResponseWithPermissionsDto;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.PermissionType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserConverter {

  public UserResponsePublicDto toUserResponsePublicDto(ApplicationUser applicationUser) {
    return new UserResponsePublicDto(
      applicationUser.getId(), applicationUser.getActualUsername());
  }

  public UserResponseWithPermissionsDto toUserResponseWithPermissionsDto(
    ApplicationUser applicationUser, List<PermissionType> permissions) {
    return new UserResponseWithPermissionsDto(
      applicationUser.getId(), applicationUser.getActualUsername(), permissions);
  }

  public List<UserResponsePublicDto> toUserResponsePublicDtos(
    List<ApplicationUser> applicationUsers) {
    return applicationUsers.stream().map(this::toUserResponsePublicDto).collect(
      Collectors.toList());
  }

  public UserResponsePrivateDto toUserResponsePrivateDto(ApplicationUser applicationUser) {
    return new UserResponsePrivateDto(
      applicationUser.getId(), applicationUser.getActualUsername());
  }

  public List<UserResponsePrivateDto> toUserResponsePrivateDtos(
    List<ApplicationUser> applicationUsers) {
    return applicationUsers.stream().map(this::toUserResponsePrivateDto).toList();
  }
}
