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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.twoway.Xinwu.model.resetPasswordSearch;
import com.twoway.Xinwu.service.EmailService;
import com.twoway.Xinwu.service.RefreshTokenService;
import com.twoway.Xinwu.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

/* RestController 返回數據 , Controller返回視圖*/
@CrossOrigin(origins = "*" )
@Controller
@RequestMapping("/reset")
@Transactional
public class ResetPasswordController {

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

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    

    /*
     * 使用themeleaf導至resources/templates/下面的resetPassword.html ,
     * 因為是要取得頁面資訊所以使用GetMapping
     */
    // @GetMapping("/reset-password")
    // public String resetPassword(@RequestParam(name = "token") String token, Model
    // model) {

    // String username = jwtService.extractUsername(token);
    // model.addAttribute("token", token);
    // model.addAttribute("username", username);
    // //導至resetPassword.html
    // return "resetPassword";
    // }

    @PostMapping("/resetpassword")
    public ResponseEntity<String> resetPassword(@RequestBody resetPasswordSearch resetPasswordsearch) {
    // public String resetPassword(@RequestBody resetPasswordSearch resetPasswordsearch) {

        String token = resetPasswordsearch.getToken();
        String password = resetPasswordsearch.getPassword();
        String encryptedPassword = passwordEncoder.encode(password);

        System.out.println(token);

        // 將密碼重設
        Optional<RefreshToken> refreshTokenOptional = refreshTokenRepository.findByToken(token);
        User user = refreshTokenOptional.get().getUser();
        boolean isexpired = refreshTokenOptional.get().isExpired();

        System.out.println(isexpired);
        System.out.println(user);
        System.out.println(encryptedPassword);

        user.setPassword(encryptedPassword);
        userRepository.save(user);

        System.out.println(user);

        // return ResponseEntity.ok("密碼已重設");
    
        //檢查是否存在相同的token
        if (refreshTokenOptional.isPresent() && isexpired==false) {

            // 刪除已使用的token
            refreshTokenRepository.deleteByToken(token);
            
            
            return ResponseEntity.ok("密碼已重設");
            //return ResponseEntity.ok("密碼已重設");

        } else {
            // 如果找不到相應的token，返回錯誤訊息
            return ResponseEntity.ok("沒有token");
        }


    }

}