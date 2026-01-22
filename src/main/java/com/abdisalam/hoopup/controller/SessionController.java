package com.abdisalam.hoopup.controller;

import com.abdisalam.hoopup.model.Session;
import com.abdisalam.hoopup.model.User;
import com.abdisalam.hoopup.repository.SessionRepository;
import com.abdisalam.hoopup.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionController(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    // Helper method to get the currently authenticated username
    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createSession(@Valid @RequestBody Session session) {
        String username = getAuthenticatedUsername();

        Optional<User> creator = userRepository.findByUsername(username);
        if (creator.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        // Set the creator
        session.setCreator(creator.get());

        Session savedSession = sessionRepository.save(session);
        return ResponseEntity.ok(savedSession);
    }

    @GetMapping("/{id}")
    public Session getSessionById(@PathVariable Long id) {
        return sessionRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        String username = getAuthenticatedUsername();

        Session session = sessionRepository.findById(id).orElse(null);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
        }

        // Check if the current user is the creator
        if (!session.getCreator().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete sessions you created");
        }

        sessionRepository.deleteById(id);
        return ResponseEntity.ok("Session deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @Valid @RequestBody Session updatedSession) {
        String username = getAuthenticatedUsername();

        Session existingSession = sessionRepository.findById(id).orElse(null);
        if (existingSession == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
        }

        // Check if the current user is the creator
        if (!existingSession.getCreator().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit sessions you created");
        }

        // Update the fields
        existingSession.setLocationName(updatedSession.getLocationName());
        existingSession.setDate(updatedSession.getDate());
        existingSession.setStartTime(updatedSession.getStartTime());
        existingSession.setEndTime(updatedSession.getEndTime());
        existingSession.setNote(updatedSession.getNote());

        Session savedSession = sessionRepository.save(existingSession);
        return ResponseEntity.ok(savedSession);
    }

    @PostMapping("/{id}/join")
    public Session joinSession(@PathVariable Long id, @RequestBody User user) {
        Session session = sessionRepository.findById(id).orElse(null);
        if (session == null) {
            return null;
        }

        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isEmpty()) {
            return null;
        }

        if (session.getAttendees() == null) {
            session.setAttendees(new ArrayList<>());
        }

        // Check if user is already attending
        boolean alreadyJoined = session.getAttendees().stream()
                .anyMatch(attendee -> attendee.getId().equals(existingUser.get().getId()));

        if (alreadyJoined) {
            return session;
        }

        session.getAttendees().add(existingUser.get());
        return sessionRepository.save(session);
    }

    @PostMapping("/{id}/leave")
    public Session leaveSession(@PathVariable Long id, @RequestBody User user) {
        Session session = sessionRepository.findById(id).orElse(null);
        if (session == null) {
            return null;
        }

        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isEmpty()) {
            return null;
        }

        if (session.getAttendees() != null) {
            session.getAttendees().removeIf(attendee -> attendee.getId().equals(existingUser.get().getId()));
        }

        return sessionRepository.save(session);
    }
}