package com.twoway.Xinwu.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/registerUser")
    public ResponseEntity<AuthenticationResponse> registerUser(
            @RequestBody RegisterRequest request) {

        // return ResponseEntity.ok(service.registerAdmin(request));

        try {
            return service.registerUser(request);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/registerOperator")
    public ResponseEntity<AuthenticationResponse> registerOperator(
            @RequestBody RegisterRequest request) {

        // return ResponseEntity.ok(service.registerAdmin(request));

        try {
            return service.registerOperator(request);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/registerSupervisor")
    public ResponseEntity<AuthenticationResponse> registerSupervisor(
            @RequestBody RegisterRequest request) {

        // return ResponseEntity.ok(service.registerAdmin(request));

        try {
            return service.registerSupervisor(request);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(
            @RequestBody RegisterRequest request) {

        // return ResponseEntity.ok(service.registerAdmin(request));

        try {
            return service.registerAdmin(request);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    AuthenticationResponse.builder()
                            .error(e.getMessage())
                            .build());
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<AuthenticationResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .body(AuthenticationResponse.builder()
                        .error(e.getMessage())
                        .build());
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshTokens(
            @RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        AuthenticationResponse response = service.refreshTokens(refreshToken);
        return ResponseEntity.ok(response);
    }
}
