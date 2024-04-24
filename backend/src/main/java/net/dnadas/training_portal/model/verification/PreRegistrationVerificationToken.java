package net.dnadas.training_portal.model.verification;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class PreRegistrationVerificationToken extends VerificationToken {
  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = true, unique = true)
  private String fullName;

  @Column(nullable = false)
  private Long groupId;

  @Column(nullable = false)
  private Long projectId;

  @Column(nullable = false)
  private Long questionnaireId;

  public PreRegistrationVerificationToken(
    String email, String username, Long groupId, Long projectId, Long questionnaireId,
    String hashedVerificationCode, Instant expiresAt, String fullName) {
    super(TokenType.PRE_REGISTRATION, hashedVerificationCode, expiresAt);
    this.email = email.trim();
    this.username = username.trim();
    this.groupId = groupId;
    this.projectId = projectId;
    this.questionnaireId = questionnaireId;
    if (fullName != null) {
      this.fullName = fullName.trim();
    }
  }

  @Override
  public String toString() {
    return "PreRegistrationVerificationToken{" + "id=" + super.getId() + '}';
  }
}
