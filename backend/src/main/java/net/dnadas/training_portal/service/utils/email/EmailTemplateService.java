package net.dnadas.training_portal.service.utils.email;

import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailTemplateService {
  @Value("${FRONTEND_BASE_URL}")
  private String FRONTEND_BASE_URL;
  @Value("${EMAIL_TEMPLATE_DIR}")
  private String templateBasePath;
  private final Map<String, String> templateCache = new ConcurrentHashMap<>();

  private String getTemplate(String path) throws IOException {
    return templateCache.computeIfAbsent(path, p -> {
      try {
        Path fullPath = Paths.get(templateBasePath, p);
        return Files.readString(fullPath);
      } catch (IOException e) {
        throw new UncheckedIOException("Failed to load email template: " + path, e);
      }
    });
  }

  public EmailRequestDto getRegistrationEmailDto(
    VerificationTokenDto verificationTokenDto, String toEmail, String fullName, Locale locale)
    throws IOException {
    final String path;
    final String subject;
    if (locale.equals(Locale.of("hu", "HU"))) {
      path = "registration_verification_email_hu.html";
      subject = "E-mail megerősítés a tesztsor.hu használatához";
    } else {
      path = "registration_verification_email_en.html";
      subject = "Registration verification to Training Portal";
    }
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/registration?code=%s&id=%s", verificationTokenDto);
    return new EmailRequestDto(
      toEmail, subject,
      String.format(template, fullName, verificationUrl));
  }

  public EmailRequestDto getEmailChangeVerificationEmailDto(
    VerificationTokenDto verificationTokenDto, String email, String fullName, Locale locale)
    throws IOException {
    final String path;
    final String subject;
    if (locale.equals(Locale.of("hu", "HU"))) {
      path = "email_change_email_hu.html";
      subject = "Email változtatás megerősítése";
    } else {
      path = "email_change_email_en.html";
      subject = "Email change verification";
    }
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/email-change?code=%s&id=%s", verificationTokenDto);
    return new EmailRequestDto(email, subject,
      String.format(template, fullName, verificationUrl));
  }

  public EmailRequestDto getPasswordResetEmailDto(
    VerificationTokenDto verificationTokenDto, String email, String fullName, Locale locale)
    throws IOException {
    final String path;
    final String subject;
    if (locale.equals(Locale.of("hu", "HU"))) {
      path = "password_reset_email_hu.html";
      subject = "Jelszó változtatás megerősítése";
    } else {
      path = "password_reset_email_en.html";
      subject = "Password reset verification";
    }
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/password-reset?code=%s&id=%s", verificationTokenDto);
    return new EmailRequestDto(email, subject,
      String.format(template, fullName, verificationUrl));
  }

  public EmailRequestDto getPreRegisterEmailDto(
    VerificationTokenDto verificationTokenDto, String fullName, String email, String projectName,
    Locale locale)
    throws IOException {
    final String path;
    final String subject;
    if (locale.equals(Locale.of("hu", "HU"))) {
      path = "preregister_user_email_hu.html";
      subject = "E-mail megerősítés a tesztsor.hu használatához";
    } else {
      path = "preregister_user_email_en.html";
      subject = "Invitation to join tesztsor.hu";
    }
    String template = getTemplate(path);
    String verificationUrl = getVerificationUrl(
      "%s/redirect/invitation?code=%s&id=%s", verificationTokenDto);
    return new EmailRequestDto(email, subject,
      String.format(template, fullName, projectName, verificationUrl));
  }

  public EmailRequestDto getCompletionEmailDto(
    String fullName, String email, String projectName, Locale locale)
    throws IOException {
    final String path;
    final String subject;
    if (locale.equals(Locale.of("hu", "HU"))) {
      path = "project_successful_completion_email_hu.html";
      subject = "Email megerősítés a project előfeltételeinek teljesítéséről";
    } else {
      path = "password_reset_email_en.html";
      subject = "Email verification of successful completion of project prerequisites";
    }
    String template = getTemplate(path);
    return new EmailRequestDto(
      email, subject,
      String.format(template, fullName, projectName));
  }

  private String getVerificationUrl(String url, VerificationTokenDto verificationTokenDto) {
    String verificationUrl = String.format(url, FRONTEND_BASE_URL,
      URLEncoder.encode(verificationTokenDto.verificationCode().toString(), StandardCharsets.UTF_8),
      URLEncoder.encode(verificationTokenDto.id().toString(), StandardCharsets.UTF_8));
    return verificationUrl;
  }
}
