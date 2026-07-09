package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.RegisterRequest;
import com.tea_management.tea_backend.model.User;
import com.tea_management.tea_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PLACE AT:
 * src/main/java/com/tea_management/tea_backend/controller/AuthController.java
 *
 * Endpoints:
 *   POST /api/auth/login     { email, password }  → User object or 401
 *   POST /api/auth/register  RegisterRequest       → User object or 400
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"https://smartteamonitor.com", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank())
            return ResponseEntity.badRequest().body("Email and password are required.");

        User user = authService.login(email, password);
        if (user == null)
            return ResponseEntity.status(401).body("Invalid email or password.");

        // Never return password field
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Basic validation
        if (req.getFullName() == null || req.getFullName().isBlank())
            return ResponseEntity.badRequest().body("Full name is required.");
        if (req.getEmail() == null || req.getEmail().isBlank())
            return ResponseEntity.badRequest().body("Email is required.");
        if (req.getPassword() == null || req.getPassword().length() < 6)
            return ResponseEntity.badRequest().body("Password must be at least 6 characters.");

        try {
            User created = authService.register(req);
            created.setPassword(null);  // never return password
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
