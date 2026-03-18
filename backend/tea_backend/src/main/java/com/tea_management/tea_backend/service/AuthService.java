package com.tea_management.tea_backend.service;

import com.tea_management.tea_backend.model.User;
import com.tea_management.tea_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword() != null
                && user.get().getPassword().equals(password)) {
            return user.get();
        } else {
            return null;
        }
    }
}