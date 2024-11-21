package com.twoway.Xinwu.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.twoway.Xinwu.entity.RefreshTokenRepository;
import com.twoway.Xinwu.entity.User;
import com.twoway.Xinwu.entity.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private  RefreshTokenRepository refreshTokenRepository;



    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);
        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList()
        );
    }

    public boolean isValidUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user != null;
    }


    public void registerUser(User user){
        userRepository.save(user);
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // public void deleteUser(Integer userId) {
    //     userRepository.deleteById(userId);
    // }

    @Transactional
    public void deleteUser(Long id) {
        refreshTokenRepository.deleteByUserId(id);
        var user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户未找到"));
        userRepository.delete(user);
    }
    
}
