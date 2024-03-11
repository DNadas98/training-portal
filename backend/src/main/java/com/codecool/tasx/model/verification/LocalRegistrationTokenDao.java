package com.codecool.tasx.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalRegistrationTokenDao extends JpaRepository<LocalRegistrationToken, Long> {
  Optional<LocalRegistrationToken> findByEmail(String email);
}
