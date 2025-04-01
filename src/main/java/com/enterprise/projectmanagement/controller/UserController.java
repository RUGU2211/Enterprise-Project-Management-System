package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            // Get authentication from SecurityContextHolder
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                logger.warn("No authenticated user found");
                return ResponseEntity.status(401).body(createErrorResponse("Unauthorized", "No active session"));
            }

            // Extract username from authentication
            String username = authentication.getName();
            logger.info("Fetching user info for: {}", username);

            // Fetch user details
            Optional<User> userOptional = userService.getUserByUsername(username);

            if (userOptional.isEmpty()) {
                logger.error("User not found: {}", username);
                return ResponseEntity.status(404).body(createErrorResponse("Not Found", "User details not available"));
            }

            User currentUser = userOptional.get();

            // Prepare user information
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", currentUser.getId());
            userInfo.put("username", currentUser.getUsername());
            userInfo.put("email", currentUser.getEmail());
            userInfo.put("fullName", currentUser.getFullName());
            userInfo.put("avatarUrl", currentUser.getAvatarUrl());

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            logger.error("Error fetching current user", e);
            return ResponseEntity.status(500).body(createErrorResponse("Server Error", "Could not fetch user information"));
        }
    }

    // Utility method to create error response
    private Map<String, String> createErrorResponse(String error, String message) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        return errorResponse;
    }
}