package net.dnadas.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PreRegistrationVerificationTokenDao
  extends JpaRepository<PreRegistrationVerificationToken, Long> {
}
