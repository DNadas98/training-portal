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
public class FacebookOAuth2UserAccount
  extends OAuth2UserAccount {
  protected FacebookOAuth2UserAccount(String email) {
    super(email, AccountType.FACEBOOK);
  }
}
