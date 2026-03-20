package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.dto.ChangePasswordDTO;
import com.tea_management.tea_backend.dto.UpdateProfileDTO;
import com.tea_management.tea_backend.dto.UserProfileDTO;
import com.tea_management.tea_backend.model.Division;
import com.tea_management.tea_backend.model.Estate;
import com.tea_management.tea_backend.model.User;
import com.tea_management.tea_backend.repository.DivisionRepository;
import com.tea_management.tea_backend.repository.EstateRepository;
import com.tea_management.tea_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private EstateRepository estateRepository;
    @Autowired private DivisionRepository divisionRepository;

    /** Build a full profile DTO for a given user ID */
    public UserProfileDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setMobileNum(user.getMobileNum());
        dto.setJoinedDate(user.getJoinedDate());
        dto.setAddress(user.getAddress());
        dto.setDepartment(user.getDepartment());

        // Resolve estate
        if (user.getEstateId() != null) {
            dto.setEstateId(user.getEstateId());
            estateRepository.findById(user.getEstateId()).ifPresent(e -> dto.setEstateName(e.getEstateName()));
        }

        // Resolve division
        if (user.getDivisionId() != null) {
            dto.setDivisionId(user.getDivisionId());
            divisionRepository.findById(user.getDivisionId()).ifPresent(d -> dto.setDivisionName(d.getDivisionName()));
        }

        return dto;
    }

    /** Update editable fields: fullName, mobileNum, address */
    public UserProfileDTO updateProfile(String userId, UpdateProfileDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (dto.getFullName() != null && !dto.getFullName().isBlank())
            user.setFullName(dto.getFullName());
        if (dto.getMobileNum() != null)
            user.setMobileNum(dto.getMobileNum());
        if (dto.getAddress() != null)
            user.setAddress(dto.getAddress());

        userRepository.save(user);
        return getProfile(userId);
    }

    /** Change password — validates current password first */
    public void changePassword(String userId, ChangePasswordDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (!dto.getCurrentPassword().equals(user.getPassword()))
            throw new RuntimeException("Current password is incorrect.");

        if (dto.getNewPassword() == null || dto.getNewPassword().length() < 6)
            throw new RuntimeException("New password must be at least 6 characters.");

        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }
}
