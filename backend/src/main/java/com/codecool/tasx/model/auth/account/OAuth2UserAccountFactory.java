package com.codecool.tasx.model.auth.account;

import org.springframework.stereotype.Component;

@Component
public class OAuth2UserAccountFactory {
  public static OAuth2UserAccount getAccount(String email, AccountType accountType) {
    switch (accountType) {
      case GOOGLE:
        return new GoogleOAuth2UserAccount(email);
      case GITHUB:
        return new GithubOAuth2UserAccount(email);
      case FACEBOOK:
        return new FacebookOAuth2UserAccount(email);
      default:
        throw new IllegalArgumentException("Unsupported account type: " + accountType);
    }
  }
}
