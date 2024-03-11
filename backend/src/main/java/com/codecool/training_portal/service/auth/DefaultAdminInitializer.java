package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.dto.auth.RegisterRequestDto;
import com.codecool.training_portal.exception.validation.CustomValidationException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
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
    Optional<ApplicationUser> existingUser = applicationUserDao.findByEmail(email);
    if (existingUser.isPresent()) {
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

    String hashedPassword = passwordEncoder.encode(dto.password());
    ApplicationUser defaultAdminUser = new ApplicationUser(dto.username(), dto.email(),
      hashedPassword);
    defaultAdminUser.addGlobalRole(GlobalRole.ADMIN);
    applicationUserDao.save(defaultAdminUser);
    logger.info("Default global administrator account initialized successfully");
  }
}
