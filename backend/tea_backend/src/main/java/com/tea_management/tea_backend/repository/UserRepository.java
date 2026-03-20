package com.tea_management.tea_backend.repository;

import com.tea_management.tea_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/repository/UserRepository.java
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
}
