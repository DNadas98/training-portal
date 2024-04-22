package net.dnadas.training_portal.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.dto.user.PreRegisterUsersReportDto;
import net.dnadas.training_portal.service.user.PreRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/pre-register")
@Slf4j
@RequiredArgsConstructor
public class GlobalAdminPreRegistrationController {
  private final PreRegistrationService preRegistrationService;

  @GetMapping("/users/csv-template")
  public void getPreRegisterUsersCsvTemplate(HttpServletResponse response) {
    try {
      response.setContentType("text/csv");
      response.setCharacterEncoding("UTF-8");
      response.setHeader(
        "Content-Disposition",
        "attachment; filename=\"user_pre_registration_template.csv\"");

      preRegistrationService.getPreRegisterUsersCsvTemplate(response.getOutputStream());
      response.flushBuffer();
    } catch (IOException e) {
      log.error("Failed to write CSV to response - " + e.getMessage());
      throw new RuntimeException("Failed to write CSV to response", e);
    }
  }

  @PostMapping("/users")
  public ResponseEntity<?> preRegister(
    @RequestParam("file") MultipartFile file,
    @RequestParam("groupId") Long groupId,
    @RequestParam("projectId") Long projectId,
    @RequestParam("questionnaireId") Long questionnaireId,
    @RequestParam("expiresAt") String expiresAt) {
    PreRegisterUsersReportDto reportDto = preRegistrationService.preRegisterUsers(
      groupId, projectId, questionnaireId, file, expiresAt);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", reportDto));
  }
}
