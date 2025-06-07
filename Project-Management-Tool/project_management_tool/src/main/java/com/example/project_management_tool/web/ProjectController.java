package com.example.project_management_tool.web;


import com.example.project_management_tool.domain.Project;
import com.example.project_management_tool.services.MapValidationErrorService;
import com.example.project_management_tool.services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


//Controller layer to pass all CRUD operations to service layer
@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, 
    allowedHeaders = "*", 
    exposedHeaders = {"Content-Type", "Authorization"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "true",
    maxAge = 3600)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    //creating new project
    @PostMapping("")
    public ResponseEntity<?> createNewProject(@Valid @RequestBody Project project, BindingResult result, Principal principal){
        System.out.println("==== POST /api/project ====");
        System.out.println("Creating new project: " + project.getProjectName());
        System.out.println("Project data: " + project.toString());

        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationService(result);

        //if error encountered, don't save project. Throw exception.
        if(errorMap!=null) {
            System.out.println("Validation errors: " + errorMap);
            return errorMap;
        }

        try {
            Project project1 = projectService.saveOrUpdateProject(project, principal.getName());
            System.out.println("Project created successfully: " + project1.getProjectIdentifier());
            return new ResponseEntity<Project>(project1, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating project: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("general", "Error creating project: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    //getting project by projectId
    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable String projectId, Principal principal){
        System.out.println("==== GET /api/project/" + projectId + " ====");
        
        try {
            Project project = projectService.findProjectByIdentifier(projectId, principal.getName());
            System.out.println("Retrieved project: " + project.getProjectName());
            return new ResponseEntity<Project>(project, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving project " + projectId + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Project with ID '" + projectId + "' not found: " + e.getMessage(), 
                                    HttpStatus.NOT_FOUND);
        }
    }

    //getting all projects in the database
    @GetMapping("/all")
    public ResponseEntity<?> getAllProjects(Principal principal){
        System.out.println("==== GET /api/project/all ====");
        System.out.println("User: " + (principal != null ? principal.getName() : "null"));
        
        try {
            Iterable<Project> projects = projectService.findAllProjects(principal.getName());
            System.out.println("Projects retrieved successfully");
            return new ResponseEntity<>(projects, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving projects: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error retrieving projects: " + e.getMessage(), 
                                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //deleting project by projectId
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable String projectId, Principal principal){
        System.out.println("==== DELETE /api/project/" + projectId + " ====");
        
        try {
            projectService.deleteProjectByIdentifier(projectId, principal.getName());
            System.out.println("Project deleted successfully");
            return new ResponseEntity<String>("Project with ID " + projectId + " deleted", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error deleting project " + projectId + ": " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting project: " + e.getMessage(), 
                                    HttpStatus.BAD_REQUEST);
        }
    }
    
    // Add a simple test endpoint to verify the controller is accessible
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("==== GET /api/project/test ====");
        return new ResponseEntity<>("Project controller is working!", HttpStatus.OK);
    }

    @PostMapping("/{projectId}/users")
    public ResponseEntity<?> addUserToProject(
            @PathVariable String projectId,
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        try {
            System.out.println("==== POST /api/project/" + projectId + "/users ====");
            System.out.println("Adding user to project. Payload: " + payload);
            
            Long userId = Long.parseLong(payload.get("userId").toString());
            String role = payload.getOrDefault("role", "MEMBER").toString();
            
            Project updatedProject = projectService.addUserToProject(
                    projectId, 
                    userId, 
                    role, 
                    principal.getName());
            
            System.out.println("Successfully added user " + userId + " to project " + projectId);
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error adding user to project: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
