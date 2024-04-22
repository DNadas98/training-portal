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
@EqualsAndHashCode
public class PreRegistrationVerificationToken extends VerificationToken {
  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String username;

  @Column(nullable = false)
  private Long groupId;

  @Column(nullable = false)
  private Long projectId;

  @Column(nullable = false)
  private Long questionnaireId;

  public PreRegistrationVerificationToken(
    String email, String username, Long groupId, Long projectId, Long questionnaireId,
    String hashedVerificationCode, Instant expiresAt) {
    super(TokenType.PRE_REGISTRATION, hashedVerificationCode, expiresAt);
    this.email = email;
    this.username = username;
    this.groupId = groupId;
    this.projectId = projectId;
    this.questionnaireId = questionnaireId;
  }

  @Override
  public String toString() {
    return "PreRegistrationVerificationToken{" + "id=" + super.getId() + '}';
  }
}
