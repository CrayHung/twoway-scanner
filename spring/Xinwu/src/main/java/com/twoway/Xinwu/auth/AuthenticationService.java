package com.twoway.Xinwu.auth;

import java.util.Optional;

import org.springframework.http.HttpStatus;
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

    /*
     * 權限修改為 admin , supervisor , operator , user
     */

    public ResponseEntity<AuthenticationResponse> registerSupervisor(RegisterRequest request) {

        // 檢查 username 和 password 是否為空白
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            // 如果為空白 回錯誤
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error("Username password 不可空白")
                            .build());
        }

        // 檢查 username 是否已存在
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            // 如果已存在，你可以根據你的需求拋出異常或者回傳錯誤訊息
            // throw new IllegalArgumentException("Username already exists");
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(" 已存在相同Username")
                            .build());
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .company(request.getCompany())
                .role(Role.SUPERVISOR)
                .build();

        userRepository.save(user);
        // 生成 JWT Token 和 Refresh Token
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(jwtToken)
                        .refreshToken(refreshToken.getToken())
                        .build());
    }

    public ResponseEntity<AuthenticationResponse> registerOperator(RegisterRequest request) {

        // 檢查 username 和 password 是否為空白
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            // 如果為空白 回錯誤
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error("Username password 不可空白")
                            .build());
        }

        // 檢查 username 是否已存在
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            // 如果已存在，你可以根據你的需求拋出異常或者回傳錯誤訊息
            // throw new IllegalArgumentException("Username already exists");
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(" 已存在相同Username")
                            .build());
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .company(request.getCompany())
                .role(Role.OPERATOR)
                .build();

        userRepository.save(user);
        // 生成 JWT Token 和 Refresh Token
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(jwtToken)
                        .refreshToken(refreshToken.getToken())
                        .build());
    }

    /********************************************************************** */
    public ResponseEntity<AuthenticationResponse> registerUser(RegisterRequest request) {

        // 檢查 username 和 password 是否為空白
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            // 如果為空白 回錯誤
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error("Username password 不可空白")
                            .build());
        }

        // 檢查 username 是否已存在
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            // 如果已存在，你可以根據你的需求拋出異常或者回傳錯誤訊息
            // throw new IllegalArgumentException("Username already exists");
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(" 已存在相同Username")
                            .build());
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .company(request.getCompany())
                .role(Role.USER)
                .build();

        userRepository.save(user);
        // 生成 JWT Token 和 Refresh Token
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(jwtToken)
                        .refreshToken(refreshToken.getToken())
                        .build());
    }

    public ResponseEntity<AuthenticationResponse> registerAdmin(RegisterRequest request) {

        // 檢查 username 和 password 是否為空白
        if (request.getUsername() == null || request.getUsername().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty()) {
            // 如果為空白 回錯誤
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error("Username password 不可空白")
                            .build());
        }

        // 檢查 username 是否已存在
        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser.isPresent()) {
            // 如果已存在，你可以根據你的需求拋出異常或者回傳錯誤訊息
            // throw new IllegalArgumentException("Username already exists");
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(" 已存在相同Username")
                            .build());
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .company(request.getCompany())
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);
        // 生成 JWT Token 和 Refresh Token
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .token(jwtToken)
                        .refreshToken(refreshToken.getToken())
                        .build());
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        // username , password正確 ,
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = refreshTokenService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken.getToken())
                .role(user.getRole().name())
                .company(user.getCompany())
                .build();
    }

    public AuthenticationResponse refreshTokens(String refreshToken) {

        // refreshToken過期
        if (refreshTokenService.isRefreshTokenExpired(refreshToken)) {
            return AuthenticationResponse.builder()
                    .token("expired")
                    .refreshToken("expired")
                    .build();
        }

        var user = refreshTokenService.validateRefreshToken(refreshToken);
        var jwtToken = jwtService.generateToken(user);

        /* 如果使用refreshToken後,不再回傳refreshToken的話,可以把refreshToken刪掉 */
        // refreshTokenService.deleteRefreshToken(refreshToken);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

}
