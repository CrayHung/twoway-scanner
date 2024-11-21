package com.twoway.Xinwu.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.twoway.Xinwu.entity.RefreshToken;
import com.twoway.Xinwu.entity.RefreshTokenRepository;
import com.twoway.Xinwu.entity.User;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 365;
    private static final long REFRESH_TOKEN_VALIDITY_MINUTES = 600;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken generateRefreshToken(User user) {

        Instant expirationTime = Instant.now().plus(Duration.ofDays(REFRESH_TOKEN_VALIDITY_DAYS));
        // Instant expirationTime = Instant.now().plus(Duration.ofMinutes(REFRESH_TOKEN_VALIDITY_MINUTES));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .createdDate(Instant.now())
                .expirationDate(expirationTime)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }
    

    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    public User validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        return refreshToken.getUser();
    }


    public boolean isRefreshTokenExpired(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        return token.isExpired();
    }
    
}
