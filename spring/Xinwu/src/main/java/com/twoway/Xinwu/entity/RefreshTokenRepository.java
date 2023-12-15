package com.twoway.Xinwu.entity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByToken(String token);


    // @Query(value = "DELETE FROM refresh_token WHERE token LIKE ?1")
    // void deleteTokenString(String refreshToken);
    
}
