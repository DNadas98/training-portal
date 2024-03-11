package com.codecool.tasx.model.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuth2AuthorizationRequestDao
  extends JpaRepository<OAuth2AuthorizationRequestEntity, String> {
}
