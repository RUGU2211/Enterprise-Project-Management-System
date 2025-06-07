package com.example.project_management_tool.services;

import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.domain.TeamMember;
import com.example.project_management_tool.domain.TeamRole;
import com.example.project_management_tool.exceptions.ProjectIdException;
import com.example.project_management_tool.exceptions.ProjectNotFoundException;
import com.example.project_management_tool.repositories.TeamRepository;
import com.example.project_management_tool.repositories.UserRepository;
import com.example.project_management_tool.repositories.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    @Autowired
    private EmailService emailService;
    
    public Team saveOrUpdateTeam(Team team, String username) {
        // Handle case when updating an existing team
        if (team.getId() != null) {
            Team existingTeam = teamRepository.findById(team.getId())
                    .orElseThrow(() -> new ProjectNotFoundException("Team with ID: '" + team.getId() + "' not found"));
            
            // Verify the user is the team lead
            if (!existingTeam.getTeamLead().equals(username)) {
                throw new ProjectNotFoundException("Team not found in your account");
            }
            
            // Update fields
            existingTeam.setName(team.getName());
            existingTeam.setDescription(team.getDescription());
            // Don't update teamIdentifier as it's a unique ID
            
            return teamRepository.save(existingTeam);
        }
        
        try {
            // For new team
            User user = userRepository.findByUsername(username);
            team.setUser(user);
            team.setTeamLead(username);
            
            // Create a unique team identifier if it doesn't exist
            if (team.getTeamIdentifier() == null || team.getTeamIdentifier().trim().isEmpty()) {
                String identifier = generateTeamIdentifier(team.getName());
                team.setTeamIdentifier(identifier);
            }
            
            // Save the team first
            Team savedTeam = teamRepository.save(team);
            
            // Add the creator as a member with OWNER role
            TeamMember teamMember = new TeamMember();
            teamMember.setTeam(savedTeam);
            teamMember.setUser(user);
            teamMember.setRole(TeamRole.OWNER);
            teamMemberRepository.save(teamMember);
            
            // Send email notifications to team members
            if (team.getMembers() != null) {
                team.getMembers().forEach(member -> {
                    emailService.sendTeamInvitation(team, member.getUser());
                });
            }
            
            return savedTeam;
        } catch (Exception ex) {
            throw new ProjectIdException("Error creating/updating team: " + ex.getMessage());
        }
    }
    
    public Team findTeamById(Long id, String username) {
        Team team = teamRepository.findById(id)
            .orElseThrow(() -> new ProjectNotFoundException("Team with ID '" + id + "' does not exist"));
        
        // Make sure user has access to the team
        if (!team.getUser().getUsername().equals(username)) {
            throw new ProjectNotFoundException("Team not found in your account");
        }
        
        return team;
    }
    
    public List<Team> findAllTeams(String username) {
        // Get user
        User user = userRepository.findByUsername(username);
        
        // Get teams the user leads
        List<Team> teamsLed = findTeamsLedByUser(username);
        
        // Get teams the user is a member of (but not leading)
        List<Team> teamsMember = findTeamsUserIsMemberOf(username);
        
        // Combine the lists
        List<Team> allTeams = new ArrayList<>();
        allTeams.addAll(teamsLed);
        allTeams.addAll(teamsMember);
        
        // Calculate member count for each team
        for (Team team : allTeams) {
            int memberCount = teamMemberRepository.countByTeam(team);
            team.setMemberCount(memberCount);
        }
        
        return allTeams;
    }
    
    // Find teams led by a specific user
    public List<Team> findTeamsLedByUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        
        return teamRepository.findByTeamLead(username);
    }
    
    // Find teams where a user is a member but not the leader
    public List<Team> findTeamsUserIsMemberOf(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        
        // Get team memberships
        List<TeamMember> memberships = teamMemberRepository.findByUser(user);
        
        // Extract the teams and filter out those where the user is the team lead
        return memberships.stream()
                .map(TeamMember::getTeam)
                .filter(team -> !username.equals(team.getTeamLead()))
                .collect(Collectors.toList());
    }
    
    public void deleteTeamById(Long id, String username) {
        Team team = findTeamById(id, username);
        teamRepository.delete(team);
    }

    /**
     * Generates a unique team identifier based on the team name
     * Format: First 4 letters of team name (uppercase) + random number
     */
    private String generateTeamIdentifier(String teamName) {
        if (teamName == null || teamName.trim().isEmpty()) {
            return "TEAM" + (int) (Math.random() * 1000);
        }
        
        // Get first 4 letters of team name, padded with T's if needed
        String namePart = teamName.replaceAll("[^A-Za-z]", "").toUpperCase();
        if (namePart.length() < 4) {
            namePart = namePart + "T".repeat(4 - namePart.length());
        }
        namePart = namePart.substring(0, 4);
        
        // Add random suffix to ensure uniqueness
        return namePart + (int) (Math.random() * 100);
    }
} 