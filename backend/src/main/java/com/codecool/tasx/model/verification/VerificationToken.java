package com.codecool.tasx.model.verification;

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
  private String verificationCodeHash;
  @Column(nullable = false)
  private TokenType tokenType;

  protected VerificationToken() {
  }

  protected VerificationToken(TokenType tokenType, String verificationCodeHash) {
    this.tokenType = tokenType;
    this.verificationCodeHash = verificationCodeHash;
  }

  @Override
  public String toString() {
    return "VerificationToken{" +
      "id=" + id +
      ", createdAt=" + createdAt +
      ", tokenType=" + tokenType +
      '}';
  }
}
