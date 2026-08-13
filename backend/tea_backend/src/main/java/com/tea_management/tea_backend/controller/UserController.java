package com.tea_management.tea_backend.controller;

import com.tea_management.tea_backend.dto.ChangePasswordDTO;
import com.tea_management.tea_backend.dto.UpdateProfileDTO;
import com.tea_management.tea_backend.dto.UserProfileDTO;
import com.tea_management.tea_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /** GET /api/users/{userId} — fetch full profile */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId) {
        try {
            UserProfileDTO profile = userService.getProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /** PUT /api/users/{userId} — update fullName, mobileNum, address */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String userId,
            @RequestBody UpdateProfileDTO dto) {
        try {
            UserProfileDTO updated = userService.updateProfile(userId, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    /** POST /api/users/{userId}/change-password */
    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable String userId,
            @RequestBody ChangePasswordDTO dto) {
        try {
            userService.changePassword(userId, dto);
            return ResponseEntity.ok("Password updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
