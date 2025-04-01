package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.ProjectService;
import com.enterprise.projectmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/projects")
public class ProjectController {
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectService projectService;
    private final UserService userService;

    @Autowired
    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getRecentProjects(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get current user
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Fetch recent projects for the user
            List<Project> recentProjects = (List<Project>) projectService.getUserProjects(currentUser).stream()
                    .sorted((p1, p2) -> p2.getClass().componentType().getModifiers())
                    .limit(5)
                    .collect(Collectors.toList());

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("total", recentProjects.size());
            response.put("projects", recentProjects);
            response.put("summary", getProjectSummary(recentProjects));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching recent projects", e);
            return ResponseEntity.ok(getSampleProjectData());
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/all")
    public String getAllProjects(Model model) {
        try {
            List<Project> projects = projectService.getAllProjects();
            model.addAttribute("projects", projects);
            return "projects/list";
        } catch (Exception e) {
            logger.error("Error fetching all projects", e);
            model.addAttribute("error", "Could not load projects");
            return "projects/list";
        }
    }

    @GetMapping("/{id}")
    public String getProjectDetails(@PathVariable Long id, Model model) {
        try {
            Project project = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            model.addAttribute("project", project);
            return "projects/details";
        } catch (Exception e) {
            logger.error("Error fetching project details", e);
            model.addAttribute("error", "Could not load project details");
            return "projects/details";
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/new")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String showCreateForm(Model model) {
        model.addAttribute("project", new Project());
        model.addAttribute("users", userService.getAllUsers());
        return "projects/create";
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String createProject(@Valid @ModelAttribute Project project,
                                BindingResult result,
                                @AuthenticationPrincipal UserDetails userDetails,
                                Model model) {
        try {
            if (result.hasErrors()) {
                model.addAttribute("users", userService.getAllUsers());
                return "projects/create";
            }

            // Check if project key already exists
            if (projectService.existsByKey(project.getKey())) {
                model.addAttribute("keyError", "Project key already exists");
                model.addAttribute("users", userService.getAllUsers());
                return "projects/create";
            }

            // Set current user as lead if not specified
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (project.getLead() == null) {
                project.setLead(currentUser);
            }

            // Initialize members set if null
            if (project.getMembers() == null) {
                project.setMembers(new HashSet<>());
            }

            // Add lead to members if not already included
            project.getMembers().add(project.getLead());

            projectService.createProject(project);

            return "redirect:/projects";
        } catch (Exception e) {
            logger.error("Error creating project", e);
            model.addAttribute("error", "Could not create project");
            model.addAttribute("users", userService.getAllUsers());
            return "projects/create";
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String showEditForm(@PathVariable Long id, Model model) {
        try {
            Project project = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            model.addAttribute("project", project);
            model.addAttribute("users", userService.getAllUsers());
            return "projects/edit";
        } catch (Throwable e) {
            logger.error("Error loading edit project form", e);
            model.addAttribute("error", "Could not load project edit form");
            return "projects/edit";
        }
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String updateProject(@PathVariable Long id,
                                @Valid @ModelAttribute Project project,
                                BindingResult result,
                                Model model) {
        try {
            if (result.hasErrors()) {
                model.addAttribute("users", userService.getAllUsers());
                return "projects/edit";
            }

            Project existingProject = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            // Check if project key already exists and not the same as current project
            if (!project.getKey().equals(existingProject.getKey()) && projectService.existsByKey(project.getKey())) {
                model.addAttribute("keyError", "Project key already exists");
                model.addAttribute("users", userService.getAllUsers());
                return "projects/edit";
            }

            // Update fields from form
            existingProject.setName(project.getName());
            existingProject.setKey(project.getKey());
            existingProject.setDescription(project.getDescription());
            existingProject.setLead(project.getLead());
            existingProject.setType(project.getType());

            // Add lead to members if not already included
            existingProject.getMembers().add(existingProject.getLead());

            projectService.updateProject(existingProject);

            return "redirect:/projects/" + id;
        } catch (Exception e) {
            logger.error("Error updating project", e);
            model.addAttribute("error", "Could not update project");
            model.addAttribute("users", userService.getAllUsers());
            return "projects/edit";
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return "redirect:/projects";
        } catch (Exception e) {
            logger.error("Error deleting project", e);
            return "redirect:/projects?error=Could not delete project";
        }
    }

    @GetMapping("/{id}/members")
    public String showMembers(@PathVariable Long id, Model model) {
        try {
            Project project = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            model.addAttribute("project", project);
            model.addAttribute("allUsers", userService.getAllUsers());
            return "projects/members";
        } catch (Throwable e) {
            logger.error("Error loading project members", e);
            model.addAttribute("error", "Could not load project members");
            return "projects/members";
        }
    }

    @PostMapping("/{id}/members/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String addMember(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Project project = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            User user = (User) userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            projectService.addMemberToProject(project, user);

            return "redirect:/projects/" + id + "/members";
        } catch (Throwable e) {
            logger.error("Error adding project member", e);
            return "redirect:/projects/" + id + "/members?error=Could not add member";
        }
    }

    @PostMapping("/{id}/members/remove")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String removeMember(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Project project = (Project) projectService.getProjectById(id)
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

            User user = (User) userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            // Don't remove the lead from members
            if (project.getLead().equals(user)) {
                return "redirect:/projects/" + id + "/members?error=Cannot remove project lead";
            }

            projectService.removeMemberFromProject(project, user);

            return "redirect:/projects/" + id + "/members";
        } catch (Throwable e) {
            logger.error("Error removing project member", e);
            return "redirect:/projects/" + id + "/members?error=Could not remove member";
        }
    }

    // Helper method to generate project summary
    private Map<String, Object> getProjectSummary(List<Project> projects) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProjects", projects.size());

        // Count projects by status
        Map<String, Long> statusCounts = projects.stream()
                .collect(Collectors.groupingBy(
                        project -> project.getStatus().toString(),
                        Collectors.counting()
                ));
        summary.put("statusCounts", statusCounts);

        return summary;
    }

    // Fallback method for sample data when fetching fails
    private Map<String, Object> getSampleProjectData() {
        Map<String, Object> sampleResponse = new HashMap<>();
        sampleResponse.put("total", 0);
        sampleResponse.put("projects", List.of());
        sampleResponse.put("summary", Map.of());
        return sampleResponse;
    }
}