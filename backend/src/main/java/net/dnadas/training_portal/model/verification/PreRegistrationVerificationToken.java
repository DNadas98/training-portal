package net.dnadas.training_portal.model.verification;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.dnadas.training_portal.model.auth.PermissionType;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class PreRegistrationVerificationToken extends VerificationToken {
  @ElementCollection(targetClass = PermissionType.class)
  @CollectionTable(name = "token_group_permissions", joinColumns = @JoinColumn(name = "token_id"))
  @Column(name = "permission", nullable = false)
  @Enumerated(EnumType.STRING)
  Set<PermissionType> groupPermissions = new HashSet<>();
  @ElementCollection(targetClass = PermissionType.class)
  @CollectionTable(name = "token_project_permissions", joinColumns = @JoinColumn(name = "token_id"))
  @Column(name = "permission", nullable = false)
  @Enumerated(EnumType.STRING)
  Set<PermissionType> projectPermissions = new HashSet<>();
  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false, unique = true)
  private String username;
  @Column(nullable = true)
  private String fullName;
  @Column(nullable = true)
  private String currentCoordinatorFullName;
  @Column(nullable = true)
  private Boolean hasExternalTestQuestionnaire;
  @Column(nullable = true)
  private Boolean hasExternalTestFailure;
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
