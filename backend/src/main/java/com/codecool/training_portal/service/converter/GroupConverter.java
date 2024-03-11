package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.GroupResponsePrivateDTO;
import com.codecool.training_portal.dto.group.GroupResponsePublicDTO;
import com.codecool.training_portal.dto.requests.GroupJoinRequestResponseDto;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.request.UserGroupJoinRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class GroupConverter {
  private final UserConverter userConverter;

  public List<GroupResponsePublicDTO> getGroupResponsePublicDtos(List<UserGroup> userGroups) {
    return userGroups.stream().map(
      group -> getGroupResponsePublicDto(group)).collect(Collectors.toList());
  }

  public GroupResponsePrivateDTO getGroupResponsePrivateDto(UserGroup userGroup) {
    return new GroupResponsePrivateDTO(
      userGroup.getId(), userGroup.getName(),
      userGroup.getDescription());
  }

  public GroupResponsePublicDTO getGroupResponsePublicDto(UserGroup userGroup) {
    return new GroupResponsePublicDTO(
      userGroup.getId(), userGroup.getName(),
      userGroup.getDescription());
  }

  public GroupJoinRequestResponseDto getGroupJoinRequestResponseDto(
    UserGroupJoinRequest request) {
    return new GroupJoinRequestResponseDto(request.getId(),
      getGroupResponsePublicDto(request.getUserGroup()),
      userConverter.getUserResponsePublicDto(request.getApplicationUser()), request.getStatus());
  }

  public List<GroupJoinRequestResponseDto> getGroupJoinRequestResponseDtos(
    List<UserGroupJoinRequest> requests) {
    return requests.stream().map(request -> getGroupJoinRequestResponseDto(request)).collect(
      Collectors.toList());
  }
}
