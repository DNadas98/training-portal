package com.codecool.training_portal.dto.requests;

import com.codecool.training_portal.dto.company.CompanyResponsePublicDTO;
import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.model.request.RequestStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CompanyJoinRequestResponseDto(
  @NotNull @Min(1) Long requestId,
  @NotNull CompanyResponsePublicDTO company,
  @NotNull @Valid UserResponsePublicDto user,
  @NotNull RequestStatus status) {
}
