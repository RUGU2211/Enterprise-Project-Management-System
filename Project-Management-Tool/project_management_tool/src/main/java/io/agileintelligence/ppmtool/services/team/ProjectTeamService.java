package io.agileintelligence.ppmtool.services.team;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.team.ProjectTeam;
import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.user.User;
import io.agileintelligence.ppmtool.exceptions.ProjectIdException;
import io.agileintelligence.ppmtool.exceptions.TeamNotFoundException;
import io.agileintelligence.ppmtool.repositories.ProjectRepository;
import io.agileintelligence.ppmtool.repositories.team.ProjectTeamRepository;
import io.agileintelligence.ppmtool.repositories.team.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectTeamService {
    
    @Autowired
    private ProjectTeamRepository projectTeamRepository;
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public ProjectTeam assignProjectToTeam(Long teamId, String projectIdentifier, String username) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Only the team lead can assign projects
        if (!team.getTeamLead().getUsername().equals(username)) {
            throw new TeamNotFoundException("You are not authorized to assign projects to this team");
        }
        
        Project project = projectRepository.findByProjectIdentifier(projectIdentifier.toUpperCase());
        if (project == null) {
            throw new ProjectIdException("Project with ID '" + projectIdentifier + "' does not exist");
        }
        
        // Check if project is already assigned to the team
        if (projectTeamRepository.findByTeamAndProject(team, project).isPresent()) {
            throw new TeamNotFoundException("Project is already assigned to this team");
        }
        
        ProjectTeam projectTeam = new ProjectTeam(team, project);
        return projectTeamRepository.save(projectTeam);
    }
    
    public List<Project> getTeamProjects(Long teamId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
            
        List<ProjectTeam> projectTeams = projectTeamRepository.findByTeam(team);
        return projectTeams.stream()
            .map(ProjectTeam::getProject)
            .collect(Collectors.toList());
    }
    
    public List<Team> getProjectTeams(String projectIdentifier) {
        Project project = projectRepository.findByProjectIdentifier(projectIdentifier.toUpperCase());
        if (project == null) {
            throw new ProjectIdException("Project with ID '" + projectIdentifier + "' does not exist");
        }
        
        List<ProjectTeam> projectTeams = projectTeamRepository.findByProject(project);
        return projectTeams.stream()
            .map(ProjectTeam::getTeam)
            .collect(Collectors.toList());
    }
    
    public void removeProjectFromTeam(Long teamId, String projectIdentifier, String username) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new TeamNotFoundException("Team with ID '" + teamId + "' does not exist"));
        
        // Only the team lead can unassign projects
        if (!team.getTeamLead().getUsername().equals(username)) {
            throw new TeamNotFoundException("You are not authorized to unassign projects from this team");
        }
        
        Project project = projectRepository.findByProjectIdentifier(projectIdentifier.toUpperCase());
        if (project == null) {
            throw new ProjectIdException("Project with ID '" + projectIdentifier + "' does not exist");
        }
        
        ProjectTeam projectTeam = projectTeamRepository.findByTeamAndProject(team, project)
            .orElseThrow(() -> new TeamNotFoundException("Project is not assigned to this team"));
            
        projectTeamRepository.delete(projectTeam);
    }
} 