package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProvider {
  private final ApplicationUserDao applicationUserDao;

  /**
   * Get the authenticated users ID from the SecurityContextHolder,
   * then retrieve the ApplicationUser from the repository by ID
   *
   * @throws UnauthorizedException if the user is not authenticated
   */
  @Transactional(readOnly = true)
  public ApplicationUser getAuthenticatedUser() throws UnauthorizedException {
    try {
      Long userId =
        (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      ApplicationUser user = applicationUserDao.findById(userId).orElseThrow(
        UnauthorizedException::new);
      return user;
    } catch (Exception e) {
      throw new UnauthorizedException();
    }
  }
}
