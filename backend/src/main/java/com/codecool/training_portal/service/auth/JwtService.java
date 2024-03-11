package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.dto.auth.TokenPayloadDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

  private final String accessTokenSecret;
  private final Long accessTokenExpiration;
  private final SignatureAlgorithm accessTokenAlgorithm;

  private final String refreshTokenSecret;
  private final Long refreshTokenExpiration;
  private final SignatureAlgorithm refreshTokenAlgorithm;

  public JwtService(
    @Value("${BACKEND_ACCESS_TOKEN_SECRET}") String accessTokenSecret,
    @Value("${BACKEND_ACCESS_TOKEN_EXPIRATION}") Long accessTokenExpiration,
    @Value("${BACKEND_REFRESH_TOKEN_SECRET}") String refreshTokenSecret,
    @Value("${BACKEND_REFRESH_TOKEN_EXPIRATION}") Long refreshTokenExpiration) {
    this.accessTokenSecret = accessTokenSecret;
    this.accessTokenExpiration = accessTokenExpiration;
    accessTokenAlgorithm = SignatureAlgorithm.HS256;

    this.refreshTokenSecret = refreshTokenSecret;
    this.refreshTokenExpiration = refreshTokenExpiration;
    refreshTokenAlgorithm = SignatureAlgorithm.HS256;
  }

  public String generateAccessToken(TokenPayloadDto payloadDto) {
    return generateToken(
      payloadDto, accessTokenExpiration, accessTokenSecret, accessTokenAlgorithm);
  }

  public String generateRefreshToken(TokenPayloadDto payloadDto) {
    return generateToken(payloadDto, refreshTokenExpiration, refreshTokenSecret,
      refreshTokenAlgorithm);
  }

  public boolean isAccessTokenExpired(String accessToken) {
    try {
    return isTokenExpired(accessToken, accessTokenSecret, accessTokenAlgorithm);
    } catch (JwtException e) {
      throw new UnauthorizedException();
    }
  }

  public TokenPayloadDto verifyAccessToken(String accessToken) {
    try {
    Claims claims = extractAllClaimsFromToken(accessToken, accessTokenSecret, accessTokenAlgorithm);
    return getPayloadDto(claims);
    } catch (JwtException e) {
      throw new UnauthorizedException();
    }
  }

  public TokenPayloadDto verifyRefreshToken(String refreshToken) {
    try {
      Claims claims = extractAllClaimsFromToken(refreshToken, refreshTokenSecret,
      refreshTokenAlgorithm);
    return getPayloadDto(claims);
    } catch (JwtException e) {
      throw new UnauthorizedException();
    }
  }

  private String generateToken(
    TokenPayloadDto payloadDto,
    Long expiration, String secret, SignatureAlgorithm algorithm) {
    Date now = new Date();
    Date expirationDate = new Date(now.getTime() + expiration);
    Map claims = new HashMap();

    return Jwts.builder()
      .setClaims(claims)
      .setSubject(payloadDto.email())
      .setIssuedAt(now)
      .setExpiration(expirationDate)
      .signWith(getSigningKey(secret), algorithm)
      .compact();
  }

  private TokenPayloadDto getPayloadDto(Claims claims) {
    try {
      String email = claims.getSubject();
      return new TokenPayloadDto(email);
    } catch (IllegalArgumentException | NullPointerException e) {
      throw new UnauthorizedException();
    }
  }

  private Key getSigningKey(String secret) {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  private boolean isTokenExpired(String token, String secret, SignatureAlgorithm algorithm) {
    try {
      return extractExpirationFromToken(token, secret, algorithm).before(new Date());
    } catch (ExpiredJwtException e) {
      return true;
    }
  }

  private <T> T extractClaimFromToken(
    String token, String secret, SignatureAlgorithm algorithm, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaimsFromToken(token, secret, algorithm);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaimsFromToken(
    String token, String secret, SignatureAlgorithm algorithm) {
    return Jwts.parserBuilder()
      .setSigningKey(getSigningKey(secret))
      .build()
      .parseClaimsJws(token)
      .getBody();
  }

  private Date extractExpirationFromToken(
    String token, String secret, SignatureAlgorithm algorithm) {
    return extractClaimFromToken(token, secret, algorithm, Claims::getExpiration);
  }
}

