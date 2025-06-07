package com.example.project_management_tool.web;

import com.example.project_management_tool.domain.TeamMember;
import com.example.project_management_tool.domain.TeamRole;
import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.services.TeamMemberService;
import com.example.project_management_tool.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
public class TeamMemberController {
    
    private static final Logger logger = LoggerFactory.getLogger(TeamMemberController.class);
    
    @Autowired
    private TeamMemberService teamMemberService;
    
    @Autowired
    private UserService userService;
    
    // Add a member to a team
    @PostMapping("/{teamId}/members")
    public ResponseEntity<?> addMemberToTeam(
            @PathVariable Long teamId, 
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        try {
            logger.info("Adding member to team {}. Payload: {}", teamId, payload);
            
            Long userId = Long.parseLong(payload.get("userId").toString());
            String roleStr = payload.getOrDefault("role", "MEMBER").toString();
            TeamRole role = TeamRole.valueOf(roleStr.toUpperCase());
            
            TeamMember teamMember = teamMemberService.addMemberToTeam(
                    teamId, 
                    userId, 
                    role, 
                    principal.getName());
            
            logger.info("Successfully added member {} to team {}", userId, teamId);
            return new ResponseEntity<>(teamMember, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error adding member to team {}: {}", teamId, e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all members of a team
    @GetMapping("/{teamId}/members")
    public ResponseEntity<?> getTeamMembers(
            @PathVariable Long teamId,
            Principal principal) {
        try {
            logger.info("Fetching members for team {}", teamId);
            List<TeamMember> members = teamMemberService.getTeamMembers(teamId, principal.getName());
            return new ResponseEntity<>(members, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching team members for team {}: {}", teamId, e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Remove a member from a team
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            Principal principal) {
        try {
            logger.info("Removing member {} from team {}", userId, teamId);
            teamMemberService.removeMemberFromTeam(teamId, userId, principal.getName());
            return new ResponseEntity<>("Member removed successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error removing member {} from team {}: {}", userId, teamId, e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all teams a user is a member of
    @GetMapping("/user/memberships")
    public ResponseEntity<?> getUserTeams(Principal principal) {
        try {
            logger.info("Fetching team memberships for user {}", principal.getName());
            List<TeamMember> teams = teamMemberService.getUserTeams(principal.getName());
            return new ResponseEntity<>(teams, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching team memberships for user {}: {}", principal.getName(), e.getMessage(), e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
} 