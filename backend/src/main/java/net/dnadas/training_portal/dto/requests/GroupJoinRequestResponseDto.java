package net.dnadas.training_portal.dto.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.dto.group.GroupResponsePublicDTO;
import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.model.request.RequestStatus;

public record GroupJoinRequestResponseDto(
  @NotNull @Min(1) Long requestId,
  @NotNull GroupResponsePublicDTO group,
  @NotNull @Valid UserResponsePublicDto user,
  @NotNull RequestStatus status) {
}
