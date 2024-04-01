package net.dnadas.training_portal.service.verification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.model.verification.VerificationTokenDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class VerificationTokenCleanupService {
  private static final long TOKEN_CLEANUP_SCHEDULE_RATE_MS = 1000 * 60 * 60; // 1h
  private static final long TOKEN_EXPIRATION_MS = 1000 * 60 * 60; // 1h
  private final VerificationTokenDao tokenRepository;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  @Scheduled(fixedRate = TOKEN_CLEANUP_SCHEDULE_RATE_MS)
  @Transactional(rollbackOn = Exception.class)
  public void cleanExpiredTokens() {
    try {
      tokenRepository.deleteAllExpired(Instant.now().minusMillis(TOKEN_EXPIRATION_MS));

      logger.info(String.format(
        "Scheduled job to clear expired verification tokens finished successfully, next execution at %s",
        Instant.now().plusMillis(TOKEN_EXPIRATION_MS).atZone(ZoneId.of("UTC"))));
    } catch (Exception e) {
      logger.error(
        String.format(
          "Scheduled job to clear expired verification tokens failed, error: %s",
          e.getMessage() != null ? e.getMessage() : "Unknown"));
    }
  }
}
