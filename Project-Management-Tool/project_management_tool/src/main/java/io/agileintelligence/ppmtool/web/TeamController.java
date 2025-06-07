package io.agileintelligence.ppmtool.web;

import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.services.team.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, 
    allowedHeaders = "*", 
    exposedHeaders = {"Content-Type", "Authorization"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true",
    maxAge = 3600)
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping("")
    public ResponseEntity<?> createTeam(@Valid @RequestBody Team team, BindingResult result, Principal principal) {
        System.out.println("==== POST /api/teams ====");
        System.out.println("Received create team request: " + team);
        System.out.println("Team name: " + team.getName());
        System.out.println("Team description: " + team.getDescription());
        System.out.println("Team icon: " + team.getTeamIcon());
        System.out.println("Team color: " + team.getTeamColor());
        
        // Error validation
        if (result.hasErrors()) {
            Map<String, String> errorMap = new HashMap<>();
            result.getFieldErrors().forEach(err -> errorMap.put(err.getField(), err.getDefaultMessage()));
            System.out.println("Validation errors: " + errorMap);
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        // For testing purposes, use a default username if principal is null
        String username = (principal != null) ? principal.getName() : "test@test.com";
        System.out.println("Using username: " + username);
        
        try {
            Team newTeam = teamService.saveOrUpdateTeam(team, username);
            System.out.println("Team created successfully: " + newTeam);
            return new ResponseEntity<>(newTeam, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating team: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error creating team: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<Team>> getAllTeams() {
        System.out.println("==== GET /api/teams ====");
        
        try {
            List<Team> teams = teamService.findAllTeams();
            System.out.println("Retrieved " + teams.size() + " teams");
            
            // Add member and project counts as transient properties
            teams.forEach(team -> {
                int memberCount = team.getMembers() != null ? team.getMembers().size() : 0;
                int projectCount = team.getProjects() != null ? team.getProjects().size() : 0;
                
                System.out.println("Team: " + team.getName() + 
                                  ", Members: " + memberCount + 
                                  ", Projects: " + projectCount);
            });
            
            return new ResponseEntity<>(teams, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving teams: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<?> getTeamById(@PathVariable Long teamId) {
        System.out.println("==== GET /api/teams/" + teamId + " ====");
        
        try {
            Team team = teamService.findTeamById(teamId);
            System.out.println("Retrieved team: " + team);
            return new ResponseEntity<>(team, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving team " + teamId + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Team with ID '" + teamId + "' not found: " + e.getMessage(), 
                                      HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<?> updateTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody Team team,
            BindingResult result,
            Principal principal) {
        
        System.out.println("==== PUT /api/teams/" + teamId + " ====");
        System.out.println("Updating team: " + team);
        System.out.println("Team name: " + team.getName());
        System.out.println("Team description: " + team.getDescription());
        System.out.println("Team icon: " + team.getTeamIcon());
        System.out.println("Team color: " + team.getTeamColor());
        
        // Error validation
        if (result.hasErrors()) {
            Map<String, String> errorMap = new HashMap<>();
            result.getFieldErrors().forEach(err -> errorMap.put(err.getField(), err.getDefaultMessage()));
            System.out.println("Validation errors: " + errorMap);
            return new ResponseEntity<>(errorMap, HttpStatus.BAD_REQUEST);
        }

        // For testing purposes, use a default username if principal is null
        String username = (principal != null) ? principal.getName() : "test@test.com";
        System.out.println("Using username: " + username);
        
        try {
            team.setId(teamId);
            Team updatedTeam = teamService.saveOrUpdateTeam(team, username);
            System.out.println("Team updated successfully: " + updatedTeam);
            return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error updating team " + teamId + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error updating team: " + e.getMessage(), 
                                      HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long teamId, Principal principal) {
        System.out.println("==== DELETE /api/teams/" + teamId + " ====");
        
        // For testing purposes, use a default username if principal is null
        String username = (principal != null) ? principal.getName() : "test@test.com";
        System.out.println("Using username: " + username);
        
        try {
            teamService.deleteTeamById(teamId, username);
            System.out.println("Team deleted successfully");
            return new ResponseEntity<>("Team with ID: '" + teamId + "' was deleted", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error deleting team " + teamId + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting team: " + e.getMessage(), 
                                      HttpStatus.BAD_REQUEST);
        }
    }
    
    // Add a simple test endpoint to verify the controller is accessible
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("==== GET /api/teams/test ====");
        return new ResponseEntity<>("Team controller is working!", HttpStatus.OK);
    }
} 