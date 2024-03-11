package com.codecool.training_portal.model.verification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationTokenDao extends JpaRepository<RegistrationToken, Long> {

  @Query("SELECT rt FROM RegistrationToken rt WHERE rt.email = :email OR rt.username = :username")
  Optional<RegistrationToken> findByEmailOrUsername(
    @Param("email") String email, @Param("username") String username);
}
