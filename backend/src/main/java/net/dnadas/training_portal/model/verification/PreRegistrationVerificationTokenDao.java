package net.dnadas.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PreRegistrationVerificationTokenDao
  extends JpaRepository<PreRegistrationVerificationToken, Long> {
  Optional<PreRegistrationVerificationToken> findByEmail(String email);

  @Query("SELECT rt FROM PreRegistrationVerificationToken rt " +
    "WHERE rt.email = :email OR rt.username = :username")
  Optional<PreRegistrationVerificationToken> findByEmailOrUsername(String email, String username);
}
