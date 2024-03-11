package com.codecool.tasx.model.auth.account;

import jakarta.persistence.Entity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class GoogleOAuth2UserAccount
  extends OAuth2UserAccount {
  protected GoogleOAuth2UserAccount(String email) {
    super(email, AccountType.GOOGLE);
  }
}
