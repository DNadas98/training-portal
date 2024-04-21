package net.dnadas.training_portal.dto.user;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PreRegisterUserRequestDto(
  @NotNull @NotEmpty List<@Valid PreRegisterUserRequestDto> users) {
}
