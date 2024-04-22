package net.dnadas.training_portal.dto.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public class LoginResponseDto {
  @NotNull
  @Length(min = 1)
  private final String accessToken;
  @NotNull
  @Valid
  private final UserInfoDto userInfo;
  private final Long groupId;
  private final Long projectId;
  private final Long questionnaireId;

  public LoginResponseDto(
    String accessToken, UserInfoDto userInfo, Long groupId, Long projectId, Long questionnaireId) {
    this.accessToken = accessToken;
    this.userInfo = userInfo;
    this.groupId = groupId;
    this.projectId = projectId;
    this.questionnaireId = questionnaireId;
  }

  public LoginResponseDto(String accessToken, UserInfoDto userInfo) {
    this.accessToken = accessToken;
    this.userInfo = userInfo;
    this.groupId = null;
    this.projectId = null;
    this.questionnaireId = null;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public UserInfoDto getUserInfo() {
    return userInfo;
  }

  public Long getGroupId() {
    return groupId;
  }

  public Long getProjectId() {
    return projectId;
  }

  public Long getQuestionnaireId() {
    return questionnaireId;
  }

  @Override
  public String toString() {
    return "LoginResponseDto{" +
      "userInfo=" + userInfo +
      '}';
  }
}
