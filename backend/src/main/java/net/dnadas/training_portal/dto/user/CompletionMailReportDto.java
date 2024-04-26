package net.dnadas.training_portal.dto.user;

import java.util.List;
import java.util.Map;

public record CompletionMailReportDto(
  Integer totalUsers,
  List<CompletionMailUserInternalDto> successful,
  Map<CompletionMailUserInternalDto, String> failed) {
}
