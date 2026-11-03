package com.expensetracker.service;

import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getDefaultUser() {
        return userRepository.findByUsername("demo_user").orElseGet(() -> {
            User u = new User("demo_user", "karan@example.com", "Karan Student", 30000.0);
            u.setPassword("password");
            u.setCreatedAt(LocalDateTime.now());
            return userRepository.save(u);
        });
    }

    public User registerUser(String username, String email, String fullName, String password, Double monthlyBudget) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName != null && !fullName.trim().isEmpty() ? fullName : username);
        user.setPassword(password);
        user.setMonthlyBudget(monthlyBudget != null ? monthlyBudget : 0.0);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateMonthlyBudget(Double newBudget) {
        User user = getDefaultUser();
        user.setMonthlyBudget(newBudget);
        return userRepository.save(user);
    }
}
