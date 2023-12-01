package com.twoway.Xinwu.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.twoway.Xinwu.config.JwtService;
import com.twoway.Xinwu.entity.Role;
import com.twoway.Xinwu.entity.User;
import com.twoway.Xinwu.entity.UserRepository;
import com.twoway.Xinwu.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;



    public AuthenticationResponse register(RegisterRequest request) {

        var user = User.builder()
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.USER)
        .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
            .token(jwtToken)
            .refreshToken(refreshToken.getToken())
            .build();
    }

    public AuthenticationResponse registerAdmin(RegisterRequest request) {
        var user = User.builder()
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.ADMIN)
        .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
            .token(jwtToken)
            .refreshToken(refreshToken.getToken())
            .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), 
                request.getPassword()
            )
        );
        //username , password正確 , 
        var user = userRepository.findByUsername(request.getUsername())
            .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
            .token(jwtToken)
            .refreshToken(refreshToken.getToken())
            .build();
    }
    public AuthenticationResponse refreshTokens(String refreshToken) {

        //refreshToken過期
        if (refreshTokenService.isRefreshTokenExpired(refreshToken)) {
            return AuthenticationResponse.builder()
                        .token("expired")
                        .refreshToken("expired")
                        .build();
        }

        var user = refreshTokenService.validateRefreshToken(refreshToken);
        var jwtToken = jwtService.generateToken(user);

        /* 如果使用refreshToken後,不再回傳refreshToken的話,可以把refreshToken刪掉*/
        //refreshTokenService.deleteRefreshToken(refreshToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

}
