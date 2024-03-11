package com.codecool.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

public interface VerificationTokenDao extends JpaRepository<VerificationToken, Long> {
  @Modifying
  @Transactional
  @Query("DELETE FROM VerificationToken v WHERE v.createdAt <= :expirationDate")
  void deleteAllExpired(Instant expirationDate);
}
