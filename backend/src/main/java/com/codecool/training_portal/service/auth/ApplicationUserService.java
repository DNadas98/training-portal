package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.dto.user.UserDetailsUpdateDto;
import com.codecool.training_portal.dto.user.UserResponsePrivateDto;
import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.service.converter.UserConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationUserService {
  private final ApplicationUserDao applicationUserDao;
  private final UserConverter userConverter;
  private final UserProvider userProvider;
  private final PasswordEncoder passwordEncoder;

  public UserResponsePrivateDto getOwnUserDetails() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    return userConverter.toUserResponsePrivateDto(applicationUser);
  }

  public List<UserResponsePublicDto> getAllApplicationUsers() {
    List<ApplicationUser> users = applicationUserDao.findAll();
    return userConverter.toUserResponsePublicDtos(users);
  }

  public UserResponsePrivateDto getApplicationUserById(Long userId) throws UnauthorizedException {
    ApplicationUser user = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId)
    );
    return userConverter.toUserResponsePrivateDto(user);
  }

  @Transactional(rollbackFor = Exception.class)
  public void updateOwnDetails(UserDetailsUpdateDto updateDto) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    if (updateDto.oldPassword() == null || !passwordEncoder.matches(
      updateDto.oldPassword(), applicationUser.getPassword())) {
      throw new UnauthorizedException();
    }
    if (updateDto.username() != null) {
      applicationUser.setUsername(updateDto.username());
    }
    if (updateDto.newPassword() != null) {
      applicationUser.setPassword(passwordEncoder.encode(updateDto.newPassword()));

    }
    applicationUserDao.save(applicationUser);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteOwnApplicationUser() {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    applicationUserDao.delete(user);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteApplicationUserById(Long id) {
    ApplicationUser user = applicationUserDao.findById(id).orElseThrow(
      () -> new UserNotFoundException(id)
    );
    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      throw new UnauthorizedException();
    }
    applicationUserDao.delete(user);
  }
}
