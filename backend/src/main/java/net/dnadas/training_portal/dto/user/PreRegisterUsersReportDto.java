package net.dnadas.training_portal.dto.user;

import java.util.List;
import java.util.Map;

public record PreRegisterUsersReportDto(
  Integer totalUsers, List<PreRegisterUserInternalDto> updatedUsers,
  List<PreRegisterUserInternalDto> createdUsers,
  Map<PreRegisterUserInternalDto, String> failedUsers) {
}
