package com.codecool.tasx.service.converter;

import com.codecool.tasx.dto.user.UserResponsePrivateDto;
import com.codecool.tasx.dto.user.UserResponsePublicDto;
import com.codecool.tasx.model.user.ApplicationUser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserConverter {

  public UserResponsePublicDto getUserResponsePublicDto(ApplicationUser applicationUser) {
    return new UserResponsePublicDto(
      applicationUser.getId(), applicationUser.getUsername());
  }

  public List<UserResponsePublicDto> getUserResponsePublicDtos(
    List<ApplicationUser> applicationUsers) {
    return applicationUsers.stream().map(user -> getUserResponsePublicDto(user)).collect(
      Collectors.toList());
  }

  public UserResponsePrivateDto getUserResponsePrivateDto(ApplicationUser applicationUser) {
    return new UserResponsePrivateDto(
      applicationUser.getId(), applicationUser.getUsername());
  }

  public List<UserResponsePrivateDto> getUserResponsePrivateDtos(
    List<ApplicationUser> applicationUsers) {
    return applicationUsers.stream().map(user -> getUserResponsePrivateDto(user)).toList();
  }
}
