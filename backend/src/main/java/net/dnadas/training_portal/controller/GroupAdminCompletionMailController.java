package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.dto.user.CompletionMailReportDto;
import net.dnadas.training_portal.service.user.CompletionMailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/completion-mail")
@Slf4j
@RequiredArgsConstructor
public class GroupAdminCompletionMailController {
  private final CompletionMailService completionMailService;

  @PostMapping("/projects/{projectId}")
  public ResponseEntity<?> sendCompletionMails(
    @PathVariable("groupId") Long groupId,
    @PathVariable("projectId") Long projectId) {
    CompletionMailReportDto reportDto = completionMailService.sendCompletionMails(
      groupId, projectId, Locale.of("hu", "HU"));
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", reportDto));
  }
}
