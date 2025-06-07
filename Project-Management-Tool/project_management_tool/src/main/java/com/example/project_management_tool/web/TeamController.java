package com.example.project_management_tool.web;

import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.services.MapValidationErrorService;
import com.example.project_management_tool.services.TeamService;
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

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return new ResponseEntity<>("Teams API is working", HttpStatus.OK);
    }

    // Create a new team
    @PostMapping("")
    public ResponseEntity<?> createTeam(@Valid @RequestBody Team team, BindingResult result, Principal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) return errorMap;

        Team newTeam = teamService.saveOrUpdateTeam(team, principal.getName());
        return new ResponseEntity<>(newTeam, HttpStatus.CREATED);
    }

    // Get team by ID
    @GetMapping("/{teamId}")
    public ResponseEntity<?> getTeamById(@PathVariable String teamId, Principal principal) {
        Team team = teamService.findTeamById(Long.parseLong(teamId), principal.getName());
        return new ResponseEntity<>(team, HttpStatus.OK);
    }

    // Get all teams for the user (dashboard)
    @GetMapping("/all")
    public ResponseEntity<?> getAllTeams(Principal principal) {
        List<Team> teams = teamService.findAllTeams(principal.getName());
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    // Get teams the user leads
    @GetMapping("/lead")
    public ResponseEntity<?> getTeamsLed(Principal principal) {
        List<Team> teams = teamService.findTeamsLedByUser(principal.getName());
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    // Get teams the user is a member of (but not leading)
    @GetMapping("/member")
    public ResponseEntity<?> getTeamsMember(Principal principal) {
        List<Team> teams = teamService.findTeamsUserIsMemberOf(principal.getName());
        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    // Update team
    @PutMapping("/{teamId}")
    public ResponseEntity<?> updateTeam(@PathVariable String teamId, 
                                      @Valid @RequestBody Team team, 
                                      BindingResult result,
                                      Principal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);
        if (errorMap != null) return errorMap;

        team.setId(Long.parseLong(teamId));
        Team updatedTeam = teamService.saveOrUpdateTeam(team, principal.getName());
        return new ResponseEntity<>(updatedTeam, HttpStatus.OK);
    }

    // Delete team
    @DeleteMapping("/{teamId}")
    public ResponseEntity<?> deleteTeam(@PathVariable String teamId, Principal principal) {
        teamService.deleteTeamById(Long.parseLong(teamId), principal.getName());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Team with ID '" + teamId + "' was deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
} 