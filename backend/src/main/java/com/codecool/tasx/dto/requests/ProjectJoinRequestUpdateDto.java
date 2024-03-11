package com.codecool.tasx.dto.requests;

import com.codecool.tasx.model.request.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record ProjectJoinRequestUpdateDto(
  @NotNull RequestStatus status
) {
}
