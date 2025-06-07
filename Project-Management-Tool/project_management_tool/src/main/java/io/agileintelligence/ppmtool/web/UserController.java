package io.agileintelligence.ppmtool.web;

import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.domain.user.UserRole;
import io.agileintelligence.ppmtool.payload.JWTLoginSuccessResponse;
import io.agileintelligence.ppmtool.payload.LoginRequest;
import io.agileintelligence.ppmtool.security.JwtTokenProvider;
import io.agileintelligence.ppmtool.services.MapValidationErrorService;
import io.agileintelligence.ppmtool.services.UserService;
import io.agileintelligence.ppmtool.validator.UserValidator;
import io.agileintelligence.ppmtool.exceptions.UsernameAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static io.agileintelligence.ppmtool.security.SecurityConstants.TOKEN_PREFIX;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, 
    allowedHeaders = "*", exposedHeaders = {"Authorization"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserValidator userValidator;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        // Log the request for debugging
        System.out.println("GET /api/users/roles endpoint called");
        
        List<Map<String, String>> roles = Arrays.stream(UserRole.values())
                .map(role -> {
                    Map<String, String> roleMap = new HashMap<>();
                    roleMap.put("name", role.name());
                    roleMap.put("displayName", role.getDisplayName());
                    return roleMap;
                })
                .collect(Collectors.toList());
        
        // Log the response for debugging
        System.out.println("Returning roles: " + roles);
        
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult result) {
        ResponseEntity<?> errorMap = mapValidationErrorService.mapValidationService(result);
        if (errorMap != null) return errorMap;

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = TOKEN_PREFIX + tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JWTLoginSuccessResponse(true, jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        // Validate passwords match
        userValidator.validate(user, result);
        
        System.out.println("Register request received for: " + user.getUsername());
        System.out.println("User role: " + (user.getRole() != null ? user.getRole().name() : "null"));

        ResponseEntity<?> errorMap = mapValidationErrorService.mapValidationService(result);
        if (errorMap != null) {
            System.out.println("Validation errors: " + errorMap);
            return errorMap;
        }

        try {
            User newUser = userService.saveUser(user);
            System.out.println("User registered successfully: " + newUser.getUsername());
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (UsernameAlreadyExistsException e) {
            System.err.println("Error registering user: " + e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("Getting all users from database");
        List<User> users = userService.findAllUsers();
        
        // If no users exist, return some test data
        if (users == null || users.isEmpty()) {
            System.out.println("No users found in database, returning seed data");
            List<User> seedUsers = new ArrayList<>();
            
            // Create sample users
            for (int i = 1; i <= 5; i++) {
                User user = new User();
                user.setId(Long.valueOf(i));
                user.setUsername("user" + i + "@example.com");
                user.setFullName("Test User " + i);
                user.setPassword("********"); // Don't expose real passwords
                
                seedUsers.add(user);
            }
            
            return new ResponseEntity<>(seedUsers, HttpStatus.OK);
        }
        
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(Principal principal) {
        User user = userService.findUserByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody User user, BindingResult result, Principal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.mapValidationService(result);
        if (errorMap != null) return errorMap;
        
        User existingUser = userService.findUserByUsername(principal.getName());
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        
        // Only update certain fields
        existingUser.setFullName(user.getFullName());
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }
        
        User updatedUser = userService.updateUser(existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
} 