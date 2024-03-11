package com.codecool.tasx.model.verification;

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
public class LocalRegistrationToken extends VerificationToken {

  @Column(nullable = false, unique = true)
  private String email;
  @Column(nullable = false)
  private String username;
  @Column(nullable = false)
  private String password;

  public LocalRegistrationToken(
    String email, String username, String hashedPassword, String hashedVerificationCode) {
    super(TokenType.LOCAL_REGISTRATION, hashedVerificationCode);
    this.email = email;
    this.username = username;
    this.password = hashedPassword;
  }

  @Override
  public String toString() {
    return "LocalRegistrationToken{" +
      "email='" + email + '\'' +
      ", username='" + username + '\'' +
      '}';
  }
}
