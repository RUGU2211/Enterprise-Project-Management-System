package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserRestController {
    private static final Logger logger = LoggerFactory.getLogger(UserRestController.class);

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();

            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("total", users.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching users", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);

            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting user", e);
            return ResponseEntity.badRequest().build();
        }
    }
}