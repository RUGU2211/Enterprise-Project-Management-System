package io.agileintelligence.ppmtool.services.team;

import io.agileintelligence.ppmtool.domain.team.MemberRole;
import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.team.TeamMember;
import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.exceptions.TeamNotFoundException;
import io.agileintelligence.ppmtool.repositories.TeamMemberRepository;
import io.agileintelligence.ppmtool.repositories.team.TeamRepository;
import io.agileintelligence.ppmtool.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamMemberService {
    
    @Autowired
    private TeamMemberRepository teamMemberRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public TeamMember addMemberToTeam(Long teamId, User user, MemberRole role) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Check if user is already a member of the team
        if (teamMemberRepository.findByTeamAndUser(team, user).isPresent()) {
            throw new TeamNotFoundException("User is already a member of this team");
        }
        
        TeamMember teamMember = new TeamMember(team, user, role);
        return teamMemberRepository.save(teamMember);
    }
    
    public TeamMember addMemberToTeamByUsername(Long teamId, String username, MemberRole role, String requesterUsername) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
            
        // Check if requester is authorized (team lead or admin)
        if (!isAuthorizedForTeamManagement(team, requesterUsername)) {
            throw new TeamNotFoundException("You are not authorized to add members to this team");
        }
        
        // Find the user by username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new TeamNotFoundException("User with username '" + username + "' does not exist");
        }
        
        // Check if user is already a member
        if (teamMemberRepository.findByTeamAndUser(team, user).isPresent()) {
            throw new TeamNotFoundException("User is already a member of this team");
        }
        
        TeamMember teamMember = new TeamMember(team, user, role);
        return teamMemberRepository.save(teamMember);
    }
    
    public void removeMemberFromTeamByUsername(Long teamId, String username, String requesterUsername) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
            
        // Check if requester is authorized (team lead or admin)
        if (!isAuthorizedForTeamManagement(team, requesterUsername)) {
            throw new TeamNotFoundException("You are not authorized to remove members from this team");
        }
        
        // Find the user by username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new TeamNotFoundException("User with username '" + username + "' does not exist");
        }
        
        // Check if user is a member
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
            .orElseThrow(() -> new TeamNotFoundException("User is not a member of this team"));
            
        // Don't allow removing the team lead
        if (username.equals(team.getTeamLead())) {
            throw new TeamNotFoundException("Cannot remove team lead from the team");
        }
        
        teamMemberRepository.delete(teamMember);
    }
    
    public TeamMember changeMemberRoleByUsername(Long teamId, String username, MemberRole newRole, String requesterUsername) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
            
        // Check if requester is authorized (team lead or admin)
        if (!isAuthorizedForTeamManagement(team, requesterUsername)) {
            throw new TeamNotFoundException("You are not authorized to change member roles in this team");
        }
        
        // Find the user by username
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new TeamNotFoundException("User with username '" + username + "' does not exist");
        }
        
        // Check if user is a member
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
            .orElseThrow(() -> new TeamNotFoundException("User is not a member of this team"));
            
        // Don't allow changing the role of the team lead
        if (username.equals(team.getTeamLead())) {
            throw new TeamNotFoundException("Cannot change the role of the team lead");
        }
        
        // Update the role
        teamMember.setRole(newRole);
        return teamMemberRepository.save(teamMember);
    }
    
    public List<TeamMember> getTeamMembers(Long teamId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
            
        return teamMemberRepository.findByTeam(team);
    }
    
    public List<TeamMember> getUserTeams(User user) {
        return teamMemberRepository.findByUser(user);
    }
    
    public List<TeamMember> getTeamsForMember(User user) {
        return teamMemberRepository.findByUser(user);
    }
    
    public void removeMemberFromTeam(Long teamId, Long userId, String username) {
        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
            .orElseThrow(() -> new RuntimeException("Member not found in team"));
        teamMemberRepository.delete(member);
    }
    
    // Helper method to check if a user is authorized to manage team members
    private boolean isAuthorizedForTeamManagement(Team team, String username) {
        // Team lead is always authorized
        if (username.equals(team.getTeamLead())) {
            return true;
        }
        
        // Check if user is an admin
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return false;
        }
        
        // Check if the user has ADMIN or TEAM_LEAD role in the team
        return teamMemberRepository.findByTeamAndUser(team, user)
            .map(member -> {
                MemberRole role = member.getRole();
                return role == MemberRole.TEAM_LEAD || role == MemberRole.PROJECT_MANAGER;
            })
            .orElse(false);
    }
} 