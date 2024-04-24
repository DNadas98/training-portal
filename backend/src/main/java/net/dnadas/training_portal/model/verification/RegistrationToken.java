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
public class RegistrationToken extends VerificationToken {

  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false, unique = true)
  private String username;
  @Column(nullable = false, unique = true)
  private String fullName;
  @Column(nullable = false)
  private String password;

  public RegistrationToken(
    String email, String username, String fullName, String hashedPassword,
    String hashedVerificationCode) {
    super(TokenType.REGISTRATION, hashedVerificationCode);
    this.email = email.trim();
    this.username = username.trim();
    this.password = hashedPassword;
    this.fullName = fullName.trim();
  }

  @Override
  public String toString() {
    return "RegistrationToken{" + "id=" + super.getId() + '}';
  }
}
