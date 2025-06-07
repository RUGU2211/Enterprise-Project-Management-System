package io.agileintelligence.ppmtool.web;

import io.agileintelligence.ppmtool.domain.team.MemberRole;
import io.agileintelligence.ppmtool.domain.team.TeamMember;
import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.services.team.TeamMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin
public class TeamMemberController {
    
    @Autowired
    private TeamMemberService teamMemberService;
    
    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamMember> addMemberToTeam(
            @PathVariable Long teamId, 
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        
        Long userId = Long.parseLong(payload.get("userId").toString());
        String roleStr = payload.get("role").toString();
        MemberRole role = MemberRole.valueOf(roleStr);
        
        User user = new User();
        user.setId(userId);
        
        TeamMember teamMember = teamMemberService.addMemberToTeam(teamId, user, role);
        return new ResponseEntity<>(teamMember, HttpStatus.CREATED);
    }
    
    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMember>> getTeamMembers(@PathVariable Long teamId) {
        List<TeamMember> members = teamMemberService.getTeamMembers(teamId);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }
    
    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<?> removeMemberFromTeam(
            @PathVariable Long teamId, 
            @PathVariable Long userId, 
            Principal principal) {
        
        teamMemberService.removeMemberFromTeam(teamId, userId, principal.getName());
        return new ResponseEntity<>("Member was removed from team successfully", HttpStatus.OK);
    }
    
    // Get all teams a user is a member of
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<TeamMember>> getTeamsForMember(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        
        List<TeamMember> teamMemberships = teamMemberService.getTeamsForMember(user);
        return new ResponseEntity<>(teamMemberships, HttpStatus.OK);
    }
    
    // Add member to team by username
    @PostMapping("/{teamId}/members/add")
    public ResponseEntity<?> addMemberToTeamByUsername(
            @PathVariable Long teamId, 
            @RequestParam String username,
            @RequestParam(defaultValue = "MEMBER") String role,
            Principal principal) {
        
        try {
            MemberRole memberRole = MemberRole.valueOf(role.toUpperCase());
            TeamMember teamMember = teamMemberService.addMemberToTeamByUsername(teamId, username, memberRole, principal.getName());
            return new ResponseEntity<>(teamMember, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Remove member from team by username
    @DeleteMapping("/{teamId}/members/remove")
    public ResponseEntity<?> removeMemberFromTeamByUsername(
            @PathVariable Long teamId,
            @RequestParam String username,
            Principal principal) {
        
        try {
            teamMemberService.removeMemberFromTeamByUsername(teamId, username, principal.getName());
            return new ResponseEntity<>("Member removed successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Change member role by username
    @PutMapping("/{teamId}/members/role")
    public ResponseEntity<?> changeMemberRoleByUsername(
            @PathVariable Long teamId,
            @RequestParam String username,
            @RequestParam String role,
            Principal principal) {
        
        try {
            MemberRole memberRole = MemberRole.valueOf(role.toUpperCase());
            TeamMember updatedMember = teamMemberService.changeMemberRoleByUsername(teamId, username, memberRole, principal.getName());
            return new ResponseEntity<>(updatedMember, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
} 