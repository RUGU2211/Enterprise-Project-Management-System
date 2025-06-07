package io.agileintelligence.ppmtool.web;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.team.ProjectTeam;
import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.services.team.ProjectTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin
public class ProjectTeamController {
    
    @Autowired
    private ProjectTeamService projectTeamService;
    
    @PostMapping("/{teamId}/projects/{projectIdentifier}")
    public ResponseEntity<ProjectTeam> assignProjectToTeam(
            @PathVariable Long teamId, 
            @PathVariable String projectIdentifier, 
            Principal principal) {
        ProjectTeam projectTeam = projectTeamService.assignProjectToTeam(
                teamId, 
                projectIdentifier, 
                principal.getName());
        return new ResponseEntity<>(projectTeam, HttpStatus.CREATED);
    }
    
    @GetMapping("/{teamId}/projects")
    public ResponseEntity<List<Project>> getTeamProjects(@PathVariable Long teamId) {
        List<Project> projects = projectTeamService.getTeamProjects(teamId);
        return new ResponseEntity<>(projects, HttpStatus.OK);
    }
    
    @GetMapping("/projects/{projectIdentifier}/teams")
    public ResponseEntity<List<Team>> getProjectTeams(@PathVariable String projectIdentifier) {
        List<Team> teams = projectTeamService.getProjectTeams(projectIdentifier);
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }
    
    @DeleteMapping("/{teamId}/projects/{projectIdentifier}")
    public ResponseEntity<?> removeProjectFromTeam(
            @PathVariable Long teamId, 
            @PathVariable String projectIdentifier, 
            Principal principal) {
        projectTeamService.removeProjectFromTeam(teamId, projectIdentifier, principal.getName());
        return new ResponseEntity<>("Project was removed from team successfully", HttpStatus.OK);
    }
} 