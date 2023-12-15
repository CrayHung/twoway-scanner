package com.twoway.Xinwu.controller;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.config.JwtService;
import com.twoway.Xinwu.entity.RefreshToken;
import com.twoway.Xinwu.entity.RefreshTokenRepository;
import com.twoway.Xinwu.entity.User;
import com.twoway.Xinwu.entity.UserRepository;
import com.twoway.Xinwu.service.EmailService;
import com.twoway.Xinwu.service.UserService;

import jakarta.mail.MessagingException;


@RestController
@RequestMapping("/forget")
public class ForgetPasswordController {
    
    private static final long REFRESH_TOKEN_VALIDITY_MINUTES = 15;



    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService; 

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private EmailService emailService;


    /******傳送一組字串到email ********/
    @PostMapping("/forgetPassword")
    public ResponseEntity<String> forgetPassword(@RequestBody Map<String, String> request) throws MessagingException {

        String username = request.get("username");
        String email = request.get("email");

        var user = userRepository.findByUsername(username)
        .orElseThrow();

        
        if (user != null ) {
            String resetToken = jwtService.generateToken(userService.loadUserByUsername(username));

            // Save token in DB
            RefreshToken refreshToken = RefreshToken.builder()
            .user(user)
            .token(resetToken)
            .createdDate(Instant.now())
            .expirationDate(Instant.now().plus(Duration.ofMinutes(REFRESH_TOKEN_VALIDITY_MINUTES)))
            .build();
            refreshTokenRepository.save(refreshToken);
            
            //將token URL透過email傳送
            emailService.sendEmail(email, generateResetPasswordUrl(resetToken), "重設密碼");
            
            return ResponseEntity.ok("Reset token sent to email");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or email");
        }
    }
    
    private String generateResetPasswordUrl(String token) {
        //使用themeleaf的頁面
        //return "http://localhost:8080/reset/reset-password?token=" + token;

        //使用前端react頁面
        return "http://localhost:3000/reset-password/"+token;
    }
    /******傳送一組字串到email ********/
    /******傳送多組字串到email ********/
    // @PostMapping("/forgetPassword")
    // public ResponseEntity<String> forgetPassword(@RequestBody Map<String, String> request) throws MessagingException {

    //     String username = request.get("username");
    //     String email = request.get("email");

    //     var user = userRepository.findByUsername(username)
    //     .orElseThrow();

        
    //     if (user != null ) {
    //         String resetToken = jwtService.generateToken(userService.loadUserByUsername(username));

    //         // Save token in DB
    //         RefreshToken refreshToken = RefreshToken.builder()
    //         .user(user)
    //         .token(resetToken)
    //         .createdDate(Instant.now())
    //         .expirationDate(Instant.now().plus(Duration.ofMinutes(REFRESH_TOKEN_VALIDITY_MINUTES)))
    //         .build();
    //         refreshTokenRepository.save(refreshToken);
            
    //         //將token URL透過email傳送
    //         emailService.sendEmail(email,refreshToken, "重設密碼");
            
    //         return ResponseEntity.ok("Reset token sent to email successfully");
    //     } else {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or email");
    //     }
    // }
    /******傳送多組字串到email ********/


}
