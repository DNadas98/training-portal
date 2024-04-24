package net.dnadas.training_portal.model.verification;

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
@EqualsAndHashCode(callSuper = true)
public class PasswordResetVerificationToken extends VerificationToken {
  @Column(nullable = false, unique = true)
  private String email;

  public PasswordResetVerificationToken(String email, String hashedVerificationCode) {
    super(TokenType.PASSWORD_RESET, hashedVerificationCode);
    this.email = email.trim();
  }

  @Override
  public String toString() {
    return "PasswordResetVerificationToken{" + "id=" + super.getId() + '}';
  }
}
