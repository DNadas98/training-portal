package com.codecool.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetVerificationTokenDao
  extends JpaRepository<PasswordResetVerificationToken, Long> {

  Optional<PasswordResetVerificationToken> findByEmail(@Param("email") String email);
}
