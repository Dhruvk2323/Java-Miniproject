package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(userService.getDefaultUser());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        String fullName = (String) payload.get("fullName");
        String password = (String) payload.get("password");
        
        Double budget = 0.0;
        if (payload.get("monthlyBudget") != null) {
            try {
                budget = Double.valueOf(payload.get("monthlyBudget").toString());
            } catch (Exception ignored) {
                budget = 0.0;
            }
        }

        if (username == null || username.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "Username and email are required fields.");
            return ResponseEntity.badRequest().body(err);
        }

        try {
            User registered = userService.registerUser(username.trim(), email.trim(), fullName, password, budget);
            return new ResponseEntity<>(registered, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            Map<String, String> err = new HashMap<>();
            err.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/budget")
    public ResponseEntity<User> updateBudget(@RequestBody Map<String, Double> payload) {
        Double budget = payload.get("monthlyBudget");
        if (budget == null || budget < 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.updateMonthlyBudget(budget));
    }
}
