package com.twoway.Xinwu.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.twoway.Xinwu.entity.Role;
import com.twoway.Xinwu.entity.User;
import com.twoway.Xinwu.entity.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (!userRepository.existsByUsername("admin")) {

            User adminUser = new User();
            adminUser.setUsername("admin"); //初始創建帳號admin
            adminUser.setPassword(passwordEncoder.encode("1234")); 
            adminUser.setRole(Role.ADMIN); 
            adminUser.setCompany("Twoway"); 
            userRepository.save(adminUser);
        }
    }
}
