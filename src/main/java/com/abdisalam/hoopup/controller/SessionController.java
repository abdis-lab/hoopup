package com.abdisalam.hoopup.controller;

import com.abdisalam.hoopup.model.Session;
import com.abdisalam.hoopup.model.User;
import com.abdisalam.hoopup.repository.SessionRepository;
import com.abdisalam.hoopup.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sessions")
@CrossOrigin(origins = "http:/localhost:5173")
public class SessionController {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionController(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }


    @PostMapping
    public Session createSession(@Valid @RequestBody Session session){
        return sessionRepository.save(session);
    }


    @GetMapping("/{id}")
    public Session getSessionById(@PathVariable Long id){
        return sessionRepository.findById(id).orElse(null);
    }


    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionRepository.deleteById(id);
    }


    @PutMapping("/{id}")
    public Session updateSession(@PathVariable Long id, @RequestBody Session updatedSession){
        updatedSession.setId(id);
        return sessionRepository.save(updatedSession);
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
            return session; // User already joined, just return the session without adding again
        }

        session.getAttendees().add(existingUser.get());
        return sessionRepository.save(session);
    }



    @PostMapping("/{id}/leave")
    public Session leaveSession(@PathVariable Long id, @RequestBody User user){
        System.out.println("Leave request for session: " + id + " by user: " + user.getUsername());

        Session session = sessionRepository.findById(id).orElse(null);
        if (session == null) {
            System.out.println("Session not found");
            return null;
        }

        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isEmpty()) {
            System.out.println("User not found");
            return null;
        }

        System.out.println("Attendees before: " + (session.getAttendees() != null ? session.getAttendees().size() : 0));

        if (session.getAttendees() != null) {
            session.getAttendees().removeIf(attendee -> attendee.getId().equals(existingUser.get().getId()));
        }

        System.out.println("Attendees after: " + (session.getAttendees() != null ? session.getAttendees().size() : 0));

        return sessionRepository.save(session);
    }

}
