package com.example.project_management_tool.web;

import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/test")
public class TestEmailController {

    private static final Logger logger = LoggerFactory.getLogger(TestEmailController.class);

    @Autowired
    private EmailService emailService;

    @GetMapping("/email")
    public ResponseEntity<String> testEmail(@RequestParam String recipientEmail) {
        logger.info("Received email test request for recipient: {}", recipientEmail);
        try {
            User testUser = new User();
            testUser.setEmail(recipientEmail);
            testUser.setFullName("Test User");
            logger.info("Created test user with email: {}", recipientEmail);

            emailService.sendWelcomeEmail(testUser);
            logger.info("Email sent successfully to: {}", recipientEmail);
            return ResponseEntity.ok("Test email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", recipientEmail, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to send email: " + e.getMessage());
        }
    }
} 