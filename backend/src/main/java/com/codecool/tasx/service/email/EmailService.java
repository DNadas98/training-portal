package com.codecool.tasx.service.email;

import com.codecool.tasx.dto.email.EmailRequestDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender javaMailSender;

  @Value("${BACKEND_SMTP_USERNAME}")
  private String systemSmtpAddress;

  public void sendMailToUserAddress(EmailRequestDto mailRequest) throws MessagingException {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(mailRequest.to());
    helper.setFrom(systemSmtpAddress);
    helper.setSubject(mailRequest.subject());
    helper.setText(mailRequest.content(), true);
    javaMailSender.send(message);
  }
}
