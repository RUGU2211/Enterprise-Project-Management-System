package com.example.project_management_tool.web;

import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.payload.JWTLoginSucessReponse;
import com.example.project_management_tool.payload.LoginRequest;
import com.example.project_management_tool.security.JwtTokenProvider;
import com.example.project_management_tool.services.MapValidationErrorService;
import com.example.project_management_tool.services.UserService;
import com.example.project_management_tool.validator.UserValidator;
import com.example.project_management_tool.exceptions.UsernameAlreadyExistsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import static com.example.project_management_tool.security.SecurityConstants.TOKEN_PREFIX;

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
    public ResponseEntity<?> getUserRoles() {
        System.out.println("==== GET /api/users/roles ====");
        
        try {
            // Create a list of role objects with name and displayName
            List<Map<String, String>> roles = new ArrayList<>();
            
            Map<String, String> adminRole = new HashMap<>();
            adminRole.put("name", "ADMIN");
            adminRole.put("displayName", "Administrator");
            roles.add(adminRole);
            
            Map<String, String> developerRole = new HashMap<>();
            developerRole.put("name", "DEVELOPER");
            developerRole.put("displayName", "Developer");
            roles.add(developerRole);
            
            Map<String, String> testerRole = new HashMap<>();
            testerRole.put("name", "TESTER");
            testerRole.put("displayName", "Tester");
            roles.add(testerRole);
            
            Map<String, String> userRole = new HashMap<>();
            userRole.put("name", "USER");
            userRole.put("displayName", "Standard User");
            roles.add(userRole);
            
            System.out.println("Returning user roles: " + roles);
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error getting user roles: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error getting user roles", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult result){
        System.out.println("==== POST /api/users/login ====");
        System.out.println("Login attempt for user: " + loginRequest.getUsername());
        
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if(errorMap != null) {
            System.out.println("Validation errors: " + errorMap);
            return errorMap;
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = TOKEN_PREFIX +  tokenProvider.generateToken(authentication);
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            
            return ResponseEntity.ok(new JWTLoginSucessReponse(true, jwt));
        } catch (Exception e) {
            System.err.println("Login failed for user " + loginRequest.getUsername() + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Invalid username/password", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        // Validate passwords match
        userValidator.validate(user, result);
        
        System.out.println("==== POST /api/users/register ====");
        System.out.println("Register request received for: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Role: " + user.getRole());

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) {
            System.out.println("Validation errors: " + errorMap);
            return errorMap;
        }

        try {
            // If email is not set, use username as email
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                user.setEmail(user.getUsername());
            }
            
            // Ensure role is set (default to USER if not specified)
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }
            
            User newUser = userService.saveUser(user);
            System.out.println("User registered successfully: " + newUser.getUsername());
            System.out.println("Email saved: " + newUser.getEmail());
            System.out.println("Role saved: " + newUser.getRole());
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error registering user: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(new UsernameAlreadyExistsResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long userId, Principal principal) {
        try {
            // Get the current user making the request
            User currentUser = userService.findUserByUsername(principal.getName());
            
            // Get the user to be deleted
            User userToDelete = userService.findUserById(userId);

            // Check if user exists
            if (userToDelete == null) {
                throw new UsernameNotFoundException("User not found");
            }

            // Check if current user has permission to delete this account
            if (!currentUser.getId().equals(userId) && !currentUser.getRole().equals("ADMIN")) {
                throw new AccessDeniedException("You don't have permission to delete this account");
            }

            userService.deleteUser(userId);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        System.out.println("==== GET /api/users/all ====");
        try {
            List<User> users = userService.findAllUsers();
            System.out.println("Found " + users.size() + " users");
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error getting all users: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error getting users", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
