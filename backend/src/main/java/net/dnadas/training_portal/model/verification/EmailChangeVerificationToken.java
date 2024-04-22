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
@EqualsAndHashCode
public class EmailChangeVerificationToken extends VerificationToken {
  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private String newEmail;

  public EmailChangeVerificationToken(
    String newEmail, Long userId, String hashedVerificationCode) {
    super(TokenType.EMAIL_CHANGE, hashedVerificationCode);
    this.userId = userId;
    this.newEmail = newEmail;
  }

  @Override
  public String toString() {
    return "EmailChangeVerificationToken{" +
      "id=" + super.getId() +
      '}';
  }
}
