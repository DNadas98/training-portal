package net.dnadas.training_portal.service.utils.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender javaMailSender;

  @Value("${BACKEND_SMTP_USERNAME}")
  private String systemSmtpAddress;

  public void sendMailToUserAddress(EmailRequestDto mailRequest) throws MessagingException {
    MimeMessage message = getMimeMessage(mailRequest);
    javaMailSender.send(message);
  }

  public void sendMailsToUserAddresses(List<EmailRequestDto> mailRequests)
    throws MessagingException {
    MimeMessage[] messages = new MimeMessage[mailRequests.size()];
    int i = 0;
    for (EmailRequestDto request : mailRequests) {
      MimeMessage message = getMimeMessage(request);
      messages[i++] = message;
    }
    javaMailSender.send(messages);
  }

  private MimeMessage getMimeMessage(EmailRequestDto request) throws MessagingException {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(request.to());
    helper.setFrom(systemSmtpAddress);
    helper.setSubject(request.subject());
    helper.setText(request.content(), true);
    return message;
  }
}
