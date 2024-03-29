package com.codecool.training_portal.model.verification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PasswordResetVerificationToken extends VerificationToken {
  @Column(nullable = false)
  private String email;

  public PasswordResetVerificationToken(String email, String hashedVerificationCode) {
    super(TokenType.REGISTRATION, hashedVerificationCode);
    this.email = email;
  }

  @Override
  public String toString() {
    return "PasswordResetVerificationToken{" + "id=" + super.getId() + '}';
  }
}
