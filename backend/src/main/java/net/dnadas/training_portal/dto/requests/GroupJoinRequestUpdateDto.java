package net.dnadas.training_portal.dto.requests;

import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.request.RequestStatus;

public record GroupJoinRequestUpdateDto(@NotNull RequestStatus status) {
}
