package io.agileintelligence.ppmtool.services;

import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.exceptions.UsernameAlreadyExistsException;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public User saveUser(User newUser) {
        try {
            // Make sure the password and confirmPassword match
            // We don't persist the confirmPassword
            newUser.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
            
            // Username has to be unique (exception will be thrown if not)
            newUser.setUsername(newUser.getUsername());
            
            // Make sure that password and confirm password match
            // We don't persist the confirm password
            newUser.setConfirmPassword("");
            
            return userRepository.save(newUser);
        } catch (Exception e) {
            throw new UsernameAlreadyExistsException("Username '" + newUser.getUsername() + "' already exists");
        }
    }
    
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    public List<User> findAllUsers() {
        return (List<User>) userRepository.findAll();
    }
} 