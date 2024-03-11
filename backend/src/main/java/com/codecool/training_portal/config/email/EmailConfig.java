package com.codecool.training_portal.config.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

  @Value("${BACKEND_SMTP_HOST}")
  private String SMTP_HOST;
  @Value("${BACKEND_SMTP_PORT}")
  private Integer SMTP_PORT;
  @Value("${BACKEND_SMTP_USERNAME}")
  private String SMTP_USERNAME;
  @Value("${BACKEND_SMTP_PASSWORD}")
  private String SMTP_PASSWORD;

  @Bean
  public JavaMailSender javaMailSender() {
    return createMailSender();
  }

  private JavaMailSender createMailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost(SMTP_HOST);
    mailSender.setPort(SMTP_PORT);
    mailSender.setUsername(SMTP_USERNAME);
    mailSender.setPassword(SMTP_PASSWORD);

    Properties props = new Properties();
    props.put("mail.smtp.auth", true);
    props.put(
      "mail.smtp.socketFactory.port",
      SMTP_PORT);
    props.put(
      "mail.smtp.socketFactory.class",
      javax.net.ssl.SSLSocketFactory.getDefault());
    props.put("mail.smtp.ssl.enable", true);
    props.put("mail.smtp.ssl.trust", SMTP_HOST);

    mailSender.setJavaMailProperties(props);
    return mailSender;
  }
}
