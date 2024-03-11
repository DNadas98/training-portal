package com.codecool.tasx.model.auth.account;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@EqualsAndHashCode
public abstract class OAuth2UserAccount extends UserAccount implements OAuth2User {

  /**
   * Not persisted
   */
  @Transient
  private final Map<String, Object> attributes;

  protected OAuth2UserAccount(String email, AccountType accountType) {
    super(email, accountType);
    this.attributes = new HashMap<>();
  }

  protected OAuth2UserAccount() {
    this.attributes = new HashMap<>();
  }

  @Override
  public <T> T getAttribute(String key) {
    return (T) this.attributes.get(key);
  }

  /**
   * Get the OAuth 2.0 token attributes
   *
   * @return the OAuth 2.0 token attributes
   */
  @Override
  public Map<String, Object> getAttributes() {
    return Map.copyOf(attributes);
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return super.getApplicationUser().getGlobalRoles().stream().map(
        globalRole -> new SimpleGrantedAuthority(globalRole.name()))
      .collect(
        Collectors.toSet());
  }

  public void putAttribute(String key, Object value) {
    this.attributes.put(key, value);
  }

  public void removeAttribute(String key) {
    this.attributes.remove(key);
  }

  /**
   * Returns the name of the authenticated <code>Principal</code>. Never
   * <code>null</code>.
   *
   * @return the name of the authenticated <code>Principal</code>
   */
  @Override
  public String getName() {
    return super.getEmail();
  }
}
