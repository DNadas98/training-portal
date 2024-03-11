package com.codecool.tasx.service.auth.oauth2;

import com.codecool.tasx.model.auth.OAuth2AuthorizationRequestDao;
import com.codecool.tasx.model.auth.OAuth2AuthorizationRequestEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.SerializationUtils;

import java.util.Base64;


@Component
@RequiredArgsConstructor
public class DatabaseOAuth2AuthorizationRequestService implements
  AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

  private final OAuth2AuthorizationRequestDao requestRepositoryDao;

  /**
   * Returns the {@link OAuth2AuthorizationRequest} associated to the provided
   * {@code HttpServletRequest} or {@code null} if not available.
   *
   * @param request the {@code HttpServletRequest}
   * @return the {@link OAuth2AuthorizationRequest} or {@code null} if not available
   */
  @Override
  public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
    String state = request.getParameter("state");
    if (state != null) {
      return requestRepositoryDao.findById(state)
        .map(authRequest -> deserialize(authRequest.getSerialization()))
        .orElse(null);
    }
    return null;
  }

  /**
   * Persists the {@link OAuth2AuthorizationRequest} associating it to the provided
   * {@code HttpServletRequest} and/or {@code HttpServletResponse}.
   *
   * @param authorizationRequest the {@link OAuth2AuthorizationRequest}
   * @param request              the {@code HttpServletRequest}
   * @param response             the {@code HttpServletResponse}
   */
  @Override
  public void saveAuthorizationRequest(
    OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request,
    HttpServletResponse response) {
    if (authorizationRequest == null) {
      return;
    }
    String state = authorizationRequest.getState();
    String serializedAuthRequest = serialize(authorizationRequest);
    OAuth2AuthorizationRequestEntity entity = new OAuth2AuthorizationRequestEntity(
      state, serializedAuthRequest);
    requestRepositoryDao.save(entity);
  }

  /**
   * Removes and returns the {@link OAuth2AuthorizationRequest} associated to the
   * provided {@code HttpServletRequest} and {@code HttpServletResponse} or if not
   * available returns {@code null}.
   *
   * @param request  the {@code HttpServletRequest}
   * @param response the {@code HttpServletResponse}
   * @return the {@link OAuth2AuthorizationRequest} or {@code null} if not available
   * @since 5.1
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public OAuth2AuthorizationRequest removeAuthorizationRequest(
    HttpServletRequest request, HttpServletResponse response) {
    String state = request.getParameter("state");
    if (state != null) {
      return requestRepositoryDao.findById(state)
        .map(entity -> {
          requestRepositoryDao.deleteById(state);
          return deserialize(entity.getSerialization());
        }).orElse(null);
    }
    return null;
  }

  /**
   * @param authorizationRequest {@link OAuth2AuthorizationRequest} to be encoded to Base64
   * @return
   */
  private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
    byte[] bytes = SerializationUtils.serialize(authorizationRequest);
    return Base64.getEncoder().encodeToString(bytes);
  }

  /**
   * @param serializedObj String to be decoded from Base64 to {@link OAuth2AuthorizationRequest}
   * @return
   */
  private OAuth2AuthorizationRequest deserialize(String serializedObj) {
    byte[] bytes = Base64.getDecoder().decode(serializedObj);
    return (OAuth2AuthorizationRequest) SerializationUtils.deserialize(bytes);
  }
}
