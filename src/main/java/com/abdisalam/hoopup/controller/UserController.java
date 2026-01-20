package com.abdisalam.hoopup.controller;

import com.abdisalam.hoopup.config.JwtUtil;
import com.abdisalam.hoopup.model.User;
import com.abdisalam.hoopup.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(JwtUtil jwtUtil,UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }


    @PostMapping("/login")
    public String login(@RequestBody User user){
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());

        if(existingUser.isEmpty()){
            return "User not found";
        }

        boolean passwordMatches = passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword());

        if(!passwordMatches){
            return "Wrong password";

        }

        return jwtUtil.generateToken(user.getUsername());
    }




}
