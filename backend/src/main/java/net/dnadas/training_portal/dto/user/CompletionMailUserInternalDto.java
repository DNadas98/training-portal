package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record CompletionMailUserInternalDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @Length(min = 1, max = 100) String fullName,
  @NotNull @Email String email,
  @Length(min = 1, max = 100) String coordinatorName,
  Boolean hasExternalTestQuestionnaire,
  Boolean hasExternalTestFailure,
  Boolean receivedCompletionMail
) {
}
