package com.codecool.tasx.config.auth;

import com.codecool.tasx.model.auth.account.AccountType;
import com.codecool.tasx.model.auth.account.UserAccountDao;
import com.codecool.tasx.model.company.CompanyDao;
import com.codecool.tasx.model.company.project.ProjectDao;
import com.codecool.tasx.model.company.project.task.TaskDao;
import com.codecool.tasx.model.user.ApplicationUserDao;
import com.codecool.tasx.service.auth.CookieService;
import com.codecool.tasx.service.auth.CustomPermissionEvaluator;
import com.codecool.tasx.service.auth.RefreshService;
import com.codecool.tasx.service.auth.oauth2.DatabaseOAuth2AuthorizationRequestService;
import com.codecool.tasx.service.auth.oauth2.OAuth2AuthenticationFailureHandler;
import com.codecool.tasx.service.auth.oauth2.OAuth2AuthenticationSuccessHandler;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

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
  public UserDetailsService userDetailsService(UserAccountDao userAccountDao) {
    return username -> (UserDetails) userAccountDao.findOneByEmailAndAccountType(
      username, AccountType.LOCAL).orElseThrow(() -> new UsernameNotFoundException(
      String.format("%s account not found with the provided e-mail address",
        AccountType.LOCAL.getDisplayName())));
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider(UserAccountDao userAccountDao) {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(userDetailsService(userAccountDao));
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return daoAuthenticationProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
    throws Exception {
    return config.getAuthenticationManager();
  }

  // OAuth2

  @Bean
  public AuthenticationSuccessHandler authenticationSuccessHandler(
    AuthorizationRequestRepository<OAuth2AuthorizationRequest> requestRepository,
    CookieService cookieService, RefreshService refreshService) {
    return new OAuth2AuthenticationSuccessHandler(requestRepository, refreshService, cookieService);
  }

  @Bean
  public AuthenticationFailureHandler authenticationFailureHandler(
    DatabaseOAuth2AuthorizationRequestService requestService) {
    return new OAuth2AuthenticationFailureHandler(requestService);
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