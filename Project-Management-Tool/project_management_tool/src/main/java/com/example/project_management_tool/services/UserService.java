package com.example.project_management_tool.services;

import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.exceptions.UsernameAlreadyExistsException;
import com.example.project_management_tool.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Date;
import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EmailService emailService;

    public User saveUser (User newUser){
        try{
            newUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
            //Username has to be unique (exception)
            newUser.setUsername(newUser.getUsername());
            
            // Copy username to email field if email is not set
            if (newUser.getEmail() == null || newUser.getEmail().trim().isEmpty()) {
                newUser.setEmail(newUser.getUsername());
            }
            
            // Set default role if not provided
            if (newUser.getRole() == null || newUser.getRole().trim().isEmpty()) {
                newUser.setRole("USER");
            }
            
            // Set timestamps
            Date now = new Date();
            if (newUser.getCreate_At() == null) {
                newUser.setCreate_At(now);
            }
            newUser.setUpdate_At(now);
            
            // Make sure that password and confirmPassword match
            // We don't persist or show the confirmPassword
            newUser.setConfirmPassword("");
            
            // Save the user
            User savedUser = userRepository.save(newUser);
            
            // Send welcome email
            try {
                logger.info("Sending welcome email to: {}", savedUser.getEmail());
                emailService.sendWelcomeEmail(savedUser);
            } catch (Exception e) {
                logger.error("Failed to send welcome email to {}: {}", savedUser.getEmail(), e.getMessage());
                // Don't throw the error as the user was successfully registered
            }
            
            return savedUser;

        }catch (Exception e){
            throw new UsernameAlreadyExistsException("Username '"+newUser.getUsername()+"' already exists");
        }
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findUserById(Long id) {
        return userRepository.getById(id);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = findUserById(id);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Clear team memberships
        user.getTeamMemberships().clear();
        
        // Clear projects or reassign them
        user.getProjects().clear();
        
        // Save changes before deletion to ensure proper cleanup
        userRepository.save(user);
        
        // Finally delete the user
        userRepository.delete(user);
    }

    public List<User> findAllUsers() {
        return (List<User>) userRepository.findAll();
    }
}
