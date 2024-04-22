package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.PreRegisterUsersReportDto;
import net.dnadas.training_portal.service.user.PreRegistrationService;
import net.dnadas.training_portal.service.utils.file.CsvUtilsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/pre-register")
@RequiredArgsConstructor
public class GlobalAdminPreRegistrationController {
  private final PreRegistrationService preRegistrationService;
  private final CsvUtilsService csvUtilsService;

  @GetMapping("/users/csv-template")
  public ResponseEntity<?> getPreRegisterUsersCsvTemplate() {
    byte[] csvTemplate = csvUtilsService.getPreRegisterUsersCsvTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentDispositionFormData("attachment", "user_pre_registration_template.csv");
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    return new ResponseEntity<>(csvTemplate, headers, HttpStatus.OK);
  }

  @PostMapping("/users")
  public ResponseEntity<?> preRegister(
    @RequestParam("file") MultipartFile file,
    @RequestParam("groupId") Long groupId,
    @RequestParam("projectId") Long projectId,
    @RequestParam("questionnaireId") Long questionnaireId,
    @RequestParam("expiresAt") String expiresAt) {
    PreRegisterUsersReportDto reportDto = preRegistrationService.preRegisterUsers(
      groupId, projectId, questionnaireId, file,expiresAt);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", reportDto));
  }
}
