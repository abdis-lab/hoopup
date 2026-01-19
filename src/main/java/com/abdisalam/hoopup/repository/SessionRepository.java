package com.abdisalam.hoopup.repository;

import com.abdisalam.hoopup.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
