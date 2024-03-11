package com.codecool.training_portal.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record TokenPayloadDto(@NotNull @Email String email) {
}
