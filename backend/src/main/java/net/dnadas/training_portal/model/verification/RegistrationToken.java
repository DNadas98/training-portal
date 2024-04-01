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
public class RegistrationToken extends VerificationToken {

  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false)
  private String username;
  @Column(nullable = false)
  private String password;

  public RegistrationToken(
    String email, String username, String hashedPassword, String hashedVerificationCode) {
    super(TokenType.REGISTRATION, hashedVerificationCode);
    this.email = email;
    this.username = username;
    this.password = hashedPassword;
  }

  @Override
  public String toString() {
    return "RegistrationToken{" +
      "email='" + email + '\'' +
      ", username='" + username + '\'' +
      '}';
  }
}
