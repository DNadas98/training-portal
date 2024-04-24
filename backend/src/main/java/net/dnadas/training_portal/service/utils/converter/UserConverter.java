package net.dnadas.training_portal.service.utils.converter;

import net.dnadas.training_portal.dto.user.UserResponsePrivateDto;
import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.model.user.ApplicationUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserConverter {

  public UserResponsePublicDto toUserResponsePublicDto(ApplicationUser applicationUser) {
    return new UserResponsePublicDto(
      applicationUser.getId(), applicationUser.getActualUsername(), applicationUser.getFullName());
  }

  public List<UserResponsePublicDto> toUserResponsePublicDtos(
    List<ApplicationUser> applicationUsers) {
    return applicationUsers.stream().map(this::toUserResponsePublicDto).collect(
      Collectors.toList());
  }

  public UserResponsePrivateDto toUserResponsePrivateDto(ApplicationUser applicationUser) {
    return new UserResponsePrivateDto(
      applicationUser.getId(), applicationUser.getActualUsername(), applicationUser.getEmail(),
      applicationUser.getFullName());
  }
}
