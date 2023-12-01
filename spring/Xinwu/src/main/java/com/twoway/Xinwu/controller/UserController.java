package com.twoway.Xinwu.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.User;
import com.twoway.Xinwu.entity.UserRepository;

@CrossOrigin(origins = "*" )
@RestController
@RequestMapping("/password")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @PostMapping("/reset") 
    public String changePassword(@RequestBody User request){
        String username = request.getUsername();
        String newPassword = request.getPassword();

        var user = userRepository.findByUsername(username)
            .orElseThrow();

        if(user == null){
            return "無效username";
        }

        String encryptedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(encryptedPassword);
        userRepository.save(user);

        return "密碼更新成功";

    }
    
}
