package net.dnadas.training_portal.model.verification;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@EqualsAndHashCode
public abstract class VerificationToken {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @CreationTimestamp
  private Instant createdAt;

  @Column(nullable = false)
  private Instant expiresAt;
  @Column(nullable = false)
  private String verificationCodeHash;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private TokenType tokenType;

  protected VerificationToken() {
  }

  protected VerificationToken(TokenType tokenType, String verificationCodeHash) {
    this.tokenType = tokenType;
    this.verificationCodeHash = verificationCodeHash;
    int DEFAULT_EXPIRATION_MS = 10 * 60 * 60; // 1h
    this.expiresAt = Instant.now().plusMillis(DEFAULT_EXPIRATION_MS);
  }

  protected VerificationToken(TokenType tokenType, String verificationCodeHash, Instant expiresAt) {
    this.tokenType = tokenType;
    this.verificationCodeHash = verificationCodeHash;
    this.expiresAt = expiresAt;
  }

  @Override
  public String toString() {
    return "VerificationToken{" +
      "id=" + id +
      ", tokenType=" + tokenType +
      '}';
  }
}
