package net.dnadas.training_portal.service.utils.email;

import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
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

  private static String getTemplate(String path) throws IOException {
    String template = Files.readString(Paths.get(new ClassPathResource(path).getURI()));
    return template;
  }

  public EmailRequestDto getRegistrationEmailDto(
    VerificationTokenDto verificationTokenDto, String toEmail, String username) throws IOException {
    return new EmailRequestDto(toEmail, "Registration verification to Training Portal",
      getRegistrationEmailContent(verificationTokenDto, username));
  }

  private String getRegistrationEmailContent(
    VerificationTokenDto verificationTokenDto, String username) throws IOException {
    String path = "templates/registration_verification_email.html";
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/registration?code=%s&id=%s", verificationTokenDto);
    return String.format(template, username, verificationUrl);
  }

  public EmailRequestDto getEmailChangeVerificationEmailDto(
    VerificationTokenDto verificationTokenDto, String email, String username) throws IOException {
    return new EmailRequestDto(email, "Email change verification for Training Portal",
      getEmailChangeEmailContent(verificationTokenDto, username));
  }

  private String getEmailChangeEmailContent(
    VerificationTokenDto verificationTokenDto, String username) throws IOException {
    String path = "templates/email_change_email.html";
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/email-change?code=%s&id=%s", verificationTokenDto);
    return String.format(template, username, verificationUrl);
  }

  public EmailRequestDto getPasswordResetEmailDto(
    VerificationTokenDto verificationTokenDto, String email, String username) throws IOException {
    return new EmailRequestDto(email, "Password reset request for Training Portal",
      getPasswordResetEmailContent(verificationTokenDto, username));
  }

  private String getPasswordResetEmailContent(
    VerificationTokenDto verificationTokenDto, String username) throws IOException {
    String path = "templates/password_reset_email.html";
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/password-reset?code=%s&id=%s", verificationTokenDto);
    return String.format(template, username, verificationUrl);
  }

  private String getVerificationUrl(String url, VerificationTokenDto verificationTokenDto) {
    String verificationUrl = String.format(url, FRONTEND_BASE_URL,
      URLEncoder.encode(verificationTokenDto.verificationCode().toString(), StandardCharsets.UTF_8),
      URLEncoder.encode(verificationTokenDto.id().toString(), StandardCharsets.UTF_8));
    return verificationUrl;
  }
}
