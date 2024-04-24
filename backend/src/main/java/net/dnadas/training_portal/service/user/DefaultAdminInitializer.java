package net.dnadas.training_portal.service.user;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.auth.RegisterRequestDto;
import net.dnadas.training_portal.exception.validation.CustomValidationException;
import net.dnadas.training_portal.model.auth.GlobalRole;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.FieldError;
import org.springframework.validation.Validator;

import java.util.List;

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

  private static final String fullName = "System Administrator";

  @Transactional(rollbackFor = Exception.class)
  public void createDefaultSystemAdministratorAccount() {
    boolean adminExists = applicationUserDao.findAll(PageRequest.of(0, 1)).stream().findAny()
      .isPresent();
    if (adminExists) {
      logger.info("User accounts already exist, skipping system administrator initialization");
      return;
    }
    RegisterRequestDto dto = new RegisterRequestDto(username, email, password, fullName);
    List<FieldError> fieldErrors = validator.validateObject(dto).getFieldErrors();
    if (!fieldErrors.isEmpty()) {
      CustomValidationException e = new CustomValidationException(fieldErrors);
      logger.error(e.getMessage());
      throw e;
    }

    String hashedPassword = passwordEncoder.encode(dto.password());
    ApplicationUser defaultAdminUser = new ApplicationUser(dto.username(), dto.email(),
      hashedPassword, fullName);
    defaultAdminUser.addGlobalRole(GlobalRole.ADMIN);
    applicationUserDao.save(defaultAdminUser);
    logger.info("Default system administrator account initialized successfully");
  }
}
