package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.LoginDTO;
import com.tea_management.tea_backend.dto.RegisterRequest;
import com.tea_management.tea_backend.model.User;
import com.tea_management.tea_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/service/AuthService.java
 *
 * Replaces / extends whatever AuthService was in the original backend.
 * Uses the existing UserRepository and User model.
 */
@Service
public class AuthService {

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    public User login(String email, String password) {
        // Find by email — throw if not found or password wrong
        Optional<User> opt = userRepo.findByEmail(email);
        if (opt.isEmpty()) return null;

        User user = opt.get();
        // Plain-text comparison (swap for BCrypt if your User stores hashed password)
        if (!password.equals(user.getPassword())) return null;

        return user;
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    public User register(RegisterRequest req) {

        // Check duplicate email
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());          // plain text — add BCrypt here for production
        user.setRole(req.getRole() != null ? req.getRole() : "Field Officer");
        user.setMobileNum(req.getMobileNum());
        user.setDepartment(req.getDepartment());
        user.setAddress(req.getAddress());
        user.setJoinedDate(LocalDate.now());
        // estateId and divisionId left null — assigned by admin later

        return userRepo.save(user);
    }
}
