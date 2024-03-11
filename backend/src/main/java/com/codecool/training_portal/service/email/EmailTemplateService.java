package com.codecool.training_portal.service.email;

import com.codecool.training_portal.dto.email.EmailRequestDto;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailTemplateService {
  @Value("${FRONTEND_BASE_URL}")
  private String FRONTEND_BASE_URL;

  public EmailRequestDto getRegistrationEmailDto(
    VerificationTokenDto verificationTokenDto, String toEmail, String username)
    throws IOException {
    return new EmailRequestDto(toEmail, getRegistrationSubjectText(),
      getRegistrationEmailContent(verificationTokenDto, username));
  }

  private String getRegistrationSubjectText() {
    return "Registration verification to Spring Project Manager";
  }

  private String getRegistrationEmailContent(
    VerificationTokenDto verificationTokenDto, String username)
    throws IOException {
    String path = "templates/registration_verification_email.html";
    String template = new String(
      Files.readAllBytes(Paths.get(new ClassPathResource(path).getURI())), StandardCharsets.UTF_8);

    String verificationUrl = String.format(
      "%s/redirect/registration?code=%s&id=%s",
      FRONTEND_BASE_URL,
      URLEncoder.encode(verificationTokenDto.verificationCode().toString(), StandardCharsets.UTF_8),
      URLEncoder.encode(verificationTokenDto.id().toString(), StandardCharsets.UTF_8));

    return String.format(template, username, verificationUrl);
  }
}
