package com.example.project_management_tool.services;

import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.TeamMember;
import com.example.project_management_tool.domain.TeamRole;
import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.exceptions.ProjectNotFoundException;
import com.example.project_management_tool.repositories.TeamMemberRepository;
import com.example.project_management_tool.repositories.TeamRepository;
import com.example.project_management_tool.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamMemberService {
    
    private static final Logger logger = LoggerFactory.getLogger(TeamMemberService.class);
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    // Add a member to a team
    @Transactional
    public TeamMember addMemberToTeam(Long teamId, Long userId, TeamRole role, String requesterUsername) {
        logger.debug("Adding member {} to team {} with role {} by {}", userId, teamId, role, requesterUsername);
        
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ProjectNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Verify the requester is authorized (is team lead or has admin role)
        if (!isTeamLeadOrAdmin(team, requesterUsername)) {
            logger.warn("User {} is not authorized to add members to team {}", requesterUsername, teamId);
            throw new ProjectNotFoundException("You are not authorized to add members to this team");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ProjectNotFoundException("User with ID '" + userId + "' does not exist"));
        
        // Check if user is already a member
        if (teamMemberRepository.findByTeamAndUser(team, user).isPresent()) {
            logger.warn("User {} is already a member of team {}", userId, teamId);
            throw new ProjectNotFoundException("User is already a member of this team");
        }
        
        TeamMember teamMember = new TeamMember(team, user, role);
        TeamMember savedMember = teamMemberRepository.save(teamMember);
        
        // Send email notification
        try {
            emailService.sendTeamInvitation(team, user);
        } catch (Exception e) {
            logger.error("Failed to send team invitation email to user {}: {}", userId, e.getMessage());
            // Don't throw the error as the member was successfully added
        }
        
        logger.info("Successfully added member {} to team {} with role {}", userId, teamId, role);
        return savedMember;
    }
    
    // Helper method to check if user is team lead or admin
    private boolean isTeamLeadOrAdmin(Team team, String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        
        // Check if user is team lead
        if (team.getTeamLead().equals(username)) return true;
        
        // Check if user is admin
        return "ADMIN".equals(user.getRole());
    }
    
    // Get all members of a team
    public List<TeamMember> getTeamMembers(Long teamId, String username) {
        logger.debug("Fetching members for team {} requested by {}", teamId, username);
        
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ProjectNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Verify user has access to the team
        if (!isTeamMember(team, username)) {
            logger.warn("User {} does not have access to team {}", username, teamId);
            throw new ProjectNotFoundException("You do not have access to this team");
        }
        
        List<TeamMember> members = teamMemberRepository.findByTeam(team);
        logger.info("Found {} members in team {}", members.size(), teamId);
        return members;
    }
    
    // Helper method to check if user is a team member
    private boolean isTeamMember(Team team, String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        
        return teamMemberRepository.findByTeamAndUser(team, user).isPresent();
    }
    
    // Remove a member from a team
    @Transactional
    public void removeMemberFromTeam(Long teamId, Long userId, String requesterUsername) {
        logger.debug("Removing member {} from team {} by {}", userId, teamId, requesterUsername);
        
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ProjectNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Verify the requester is authorized
        if (!isTeamLeadOrAdmin(team, requesterUsername)) {
            logger.warn("User {} is not authorized to remove members from team {}", requesterUsername, teamId);
            throw new ProjectNotFoundException("You are not authorized to remove members from this team");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ProjectNotFoundException("User with ID '" + userId + "' does not exist"));
        
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
            .orElseThrow(() -> new ProjectNotFoundException("User is not a member of this team"));
        
        teamMemberRepository.delete(teamMember);
        logger.info("Successfully removed member {} from team {}", userId, teamId);
    }
    
    // Get all teams a user is a member of
    public List<TeamMember> getUserTeams(String username) {
        logger.debug("Fetching teams for user {}", username);
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            logger.warn("User {} not found", username);
            throw new ProjectNotFoundException("User not found");
        }
        
        List<TeamMember> teams = teamMemberRepository.findByUser(user);
        logger.info("Found {} team memberships for user {}", teams.size(), username);
        return teams;
    }
} 