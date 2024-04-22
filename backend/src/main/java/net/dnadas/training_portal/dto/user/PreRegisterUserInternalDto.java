package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record PreRegisterUserInternalDto(
  @NotNull @Length(min = 1, max = 50) String username, @NotNull @Email String email) {
}
