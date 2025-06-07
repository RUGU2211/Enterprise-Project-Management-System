package io.agileintelligence.ppmtool.services.team;

import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.exceptions.TeamIdException;
import io.agileintelligence.ppmtool.exceptions.TeamNotFoundException;
import io.agileintelligence.ppmtool.repositories.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    public Team saveOrUpdateTeam(Team team, String username) {
        // Set the team lead and the leadName
        if (team.getId() != null) {
            Team existingTeam = teamRepository.findById(team.getId())
                .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + team.getId() + "' cannot be found"));
                
            // Only the team lead or an admin can update the team
            if (!existingTeam.getTeamLead().getUsername().equals(username)) {
                throw new TeamNotFoundException("You are not authorized to update this team");
            }
            
            // Keep the team lead since we can't change it during update
            team.setTeamLead(existingTeam.getTeamLead());
        }
        
        try {
            return teamRepository.save(team);
        } catch (Exception e) {
            throw new TeamIdException("Team ID '" + team.getId() + "' already exists");
        }
    }
    
    public Team findTeamById(Long teamId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        return team;
    }
    
    public List<Team> findAllTeams() {
        return teamRepository.findAll();
    }
    
    public List<Team> findTeamsByUser(User user) {
        return teamRepository.findByTeamLead(user);
    }
    
    public void deleteTeamById(Long teamId, String username) {
        Team team = findTeamById(teamId);
        
        // Only the team lead or an admin can delete the team
        if (!team.getTeamLead().getUsername().equals(username)) {
            throw new TeamNotFoundException("You are not authorized to delete this team");
        }
        
        teamRepository.delete(team);
    }
} 