package com.expensetracker.service;

import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getDefaultUser() {
        return userRepository.findByUsername("demo_user").orElseGet(() -> {
            User u = new User("demo_user", "karan@example.com", "Karan Student", 30000.0);
            u.setCreatedAt(LocalDateTime.now());
            return userRepository.save(u);
        });
    }

    public User updateMonthlyBudget(Double newBudget) {
        User user = getDefaultUser();
        user.setMonthlyBudget(newBudget);
        return userRepository.save(user);
    }
}
