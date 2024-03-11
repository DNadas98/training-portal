package com.codecool.training_portal.config.auth;

import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.company.CompanyDao;
import com.codecool.training_portal.model.company.project.ProjectDao;
import com.codecool.training_portal.model.company.project.task.TaskDao;
import com.codecool.training_portal.service.auth.CustomPermissionEvaluator;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
@NoArgsConstructor
public class SecurityConfig {

  /**
   * Unique field of {@link UserDetailsService} that represents the subject is always called
   * "username", in our application it is the email.
   */
  @Bean
  public UserDetailsService userDetailsService(ApplicationUserDao applicationUserDao) {
    return username -> (UserDetails) applicationUserDao
      .findByEmail(username)
      .orElseThrow(() -> new UnauthorizedException());
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
  }

  @Bean
  public AuthenticationProvider authenticationProvider(ApplicationUserDao applicationUserDao) {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(userDetailsService(applicationUserDao));
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return daoAuthenticationProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
    throws Exception {
    return config.getAuthenticationManager();
  }

  // Method-level security

  /**
   * {@link EnableMethodSecurity} would not pick up {@link CustomPermissionEvaluator} by default<br>
   * <a href="https://docs.spring.io/spring-security/reference/5.8/migration/servlet/authorization.html#servlet-replace-permissionevaluator-bean-with-methodsecurityexpression-handler">
   * Spring Security Docs</a> <br>
   *
   * @param companyDao {@link CompanyDao}
   * @param projectDao {@link ProjectDao}
   * @return
   */
  @Bean
  public MethodSecurityExpressionHandler expressionHandler(
    ApplicationUserDao applicationUserDao, CompanyDao companyDao, ProjectDao projectDao,
    TaskDao taskDao) {
    var expressionHandler = new DefaultMethodSecurityExpressionHandler();
    expressionHandler.setPermissionEvaluator(
      new CustomPermissionEvaluator(applicationUserDao, companyDao, projectDao, taskDao));
    return expressionHandler;
  }
}