package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.service.user.PreRegisterService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/pre-register")
@RequiredArgsConstructor
public class GlobalAdminPreRegisterController {
  private final PreRegisterService preRegisterService;
  private final MessageSource messageSource;

  @PostMapping("/users")
  public ResponseEntity<?> preRegister(
    @RequestParam("file") MultipartFile file,
    @RequestParam("groupId") Long groupId,
    @RequestParam("projectId") Long projectId,
    @RequestParam("questionnaireId") Long questionnaireId,
    Locale locale) {
    preRegisterService.preRegisterUsers(groupId, projectId, questionnaireId, file);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
      "message",
      messageSource.getMessage("pre-register.success", null, locale)));
  }
}
