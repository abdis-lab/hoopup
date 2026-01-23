package com.abdisalam.hoopup.controller;

import com.abdisalam.hoopup.config.SecurityConfig;
import com.abdisalam.hoopup.model.Session;
import com.abdisalam.hoopup.model.User;
import com.abdisalam.hoopup.repository.SessionRepository;
import com.abdisalam.hoopup.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.swing.text.html.Option;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public UserProfileController(UserRepository userRepository, SessionRepository sessionRepository){
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }


    private String getAuthenticatedUsername(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }



    @GetMapping
    public ResponseEntity<?> getUserProfile(){
        String username = getAuthenticatedUsername();

        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        User currentUser = user.get();

        //Get sessions created by user
        List<Session> createdSessions = sessionRepository.findByCreator(currentUser);

        // Get sessions user is attending
        List<Session> attendingSessions = sessionRepository.findByAttendeesContaining(currentUser);


        Map<String, Object> profile = new HashMap<>();

        profile.put("username", currentUser.getUsername());
        profile.put("email", currentUser.getEmail());
        profile.put("sessionsCreated", createdSessions);
        profile.put("sessionsAttending", attendingSessions);
        profile.put("totalCreated", createdSessions.size());
        profile.put("totalAttending", attendingSessions.size());

        return ResponseEntity.ok(profile);
    }


}
