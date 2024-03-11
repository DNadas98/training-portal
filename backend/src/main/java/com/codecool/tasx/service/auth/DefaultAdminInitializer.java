package com.codecool.tasx.service.auth;

import com.codecool.tasx.dto.auth.RegisterRequestDto;
import com.codecool.tasx.exception.validation.CustomValidationException;
import com.codecool.tasx.model.auth.account.AccountType;
import com.codecool.tasx.model.auth.account.LocalUserAccount;
import com.codecool.tasx.model.auth.account.UserAccount;
import com.codecool.tasx.model.auth.account.UserAccountDao;
import com.codecool.tasx.model.user.ApplicationUser;
import com.codecool.tasx.model.user.ApplicationUserDao;
import com.codecool.tasx.model.user.GlobalRole;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.FieldError;
import org.springframework.validation.Validator;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DefaultAdminInitializer {
  private final UserAccountDao accountDao;
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());
  private final Validator validator;

  @Value("${BACKEND_DEFAULT_ADMIN_USERNAME}")
  private String username;

  @Value("${BACKEND_DEFAULT_ADMIN_EMAIL}")
  private String email;

  @Value("${BACKEND_DEFAULT_ADMIN_PASSWORD}")
  private String password;

  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void createDefaultSystemAdministratorAccount() {
    Optional<UserAccount> existingAccount = accountDao.findOneByEmailAndAccountType(
      email, AccountType.LOCAL);
    if (existingAccount.isPresent()) {
      logger.info("Default global administrator account already exists, skipping initialization");
      return;
    }
    RegisterRequestDto dto = new RegisterRequestDto(username, email, password);
    List<FieldError> fieldErrors = validator.validateObject(dto).getFieldErrors();
    if (!fieldErrors.isEmpty()) {
      CustomValidationException e = new CustomValidationException(fieldErrors);
      logger.error(e.getMessage());
      throw e;
    }

    ApplicationUser defaultAdminUser = new ApplicationUser(dto.username());
    defaultAdminUser.addGlobalRole(GlobalRole.ADMIN);
    applicationUserDao.save(defaultAdminUser);
    String hashedPassword = passwordEncoder.encode(dto.password());
    LocalUserAccount defaultAdminAccount = new LocalUserAccount(dto.email(), hashedPassword);
    defaultAdminAccount.setApplicationUser(defaultAdminUser);
    accountDao.save(defaultAdminAccount);
    logger.info("Default global administrator account initialized successfully");
  }
}
