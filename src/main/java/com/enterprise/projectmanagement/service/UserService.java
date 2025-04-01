package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Role;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.repository.RoleRepository;
import com.enterprise.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List getAllUsers() {
        return userRepository.findAll();
    }

    public Optional getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User createUser(User user) {
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign role
        String roleName = "";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void addRoleToUser(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Transactional
    public void removeRoleFromUser(User user, String roleName) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.getRoles().remove(role);
        userRepository.save(user);
    }
}