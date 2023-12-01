package com.twoway.Xinwu.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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



    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
        @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(service.register(request));
        }

    @PostMapping("/registerAdmin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(
        @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(service.registerAdmin(request));
        }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
        @RequestBody AuthenticationRequest request){
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
