package com.codecool.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailChangeVerificationTokenDao
  extends JpaRepository<EmailChangeVerificationToken, Long> {

  @Query(
    "SELECT t FROM EmailChangeVerificationToken t WHERE t.newEmail = :newEmail OR t.userId = :userId")
  Optional<EmailChangeVerificationToken> findByNewEmailOrUserId(
    @Param("newEmail") String newEmail, @Param("userId") Long userId);
}
