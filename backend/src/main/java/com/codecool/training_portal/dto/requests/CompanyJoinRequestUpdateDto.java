package com.codecool.training_portal.dto.requests;

import com.codecool.training_portal.model.request.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record CompanyJoinRequestUpdateDto(@NotNull RequestStatus status) {
}
