package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/budget")
    public ResponseEntity<User> updateBudget(@RequestBody Map<String, Double> payload) {
        Double budget = payload.get("monthlyBudget");
        if (budget == null || budget < 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.updateMonthlyBudget(budget));
    }
}
