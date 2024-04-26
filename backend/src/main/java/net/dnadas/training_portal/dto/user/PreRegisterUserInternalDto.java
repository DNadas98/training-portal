package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.auth.PermissionType;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record PreRegisterUserInternalDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @Length(min = 1, max = 100) String fullName,
  @NotNull @Email String email,
  @NotNull Set<PermissionType> groupPermissions,
  @NotNull Set<PermissionType> projectPermissions,
  @Length(min = 1, max = 100) String coordinatorName,
  Boolean hasExternalTestQuestionnaire,
  Boolean hasExternalTestFailure
) {
}
