package net.dnadas.training_portal.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

public record RegisterRequestDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @NotNull @Email String email,
  @NotNull @Length(min = 8, max = 50)
  @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
    message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit, and must be at least 8 characters long")
  String password,
  @NotNull @Length(min = 1, max = 100) String fullName) {

  @Override
  public String toString() {
    return "RegisterRequestDto{" +
      "username='" + username + '\'' +
      '}';
  }
}
