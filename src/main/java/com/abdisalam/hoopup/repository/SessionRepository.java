package com.abdisalam.hoopup.repository;

import com.abdisalam.hoopup.model.Session;
import com.abdisalam.hoopup.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByCreator(User creator);

    List<Session> findByAttendeesContaining(User user);

}
