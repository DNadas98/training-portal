package com.codecool.training_portal.dto.requests;

import com.codecool.training_portal.model.request.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record GroupJoinRequestUpdateDto(@NotNull RequestStatus status) {
}
