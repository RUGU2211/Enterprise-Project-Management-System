package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.ProjectService;
import com.enterprise.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;

@Controller
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    @Autowired
    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping
    public String getAllProjects(Model model) {
        List projects = projectService.getAllProjects();
        model.addAttribute("projects", projects);
        return "projects/list";
    }

    @GetMapping("/{id}")
    public String getProjectDetails(@PathVariable Long id, Model model) throws Throwable {
        Project project = (Project) projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        model.addAttribute("project", project);
        return "projects/details";
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
                                Model model) throws Throwable {

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
        if (project.getLead() == null) {
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
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
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String showEditForm(@PathVariable Long id, Model model) throws Throwable {
        Project project = (Project) projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        model.addAttribute("project", project);
        model.addAttribute("users", userService.getAllUsers());
        return "projects/edit";
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String updateProject(@PathVariable Long id,
                                @Valid @ModelAttribute Project project,
                                BindingResult result,
                                Model model) throws Throwable {

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
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return "redirect:/projects";
    }

    @GetMapping("/{id}/members")
    public String showMembers(@PathVariable Long id, Model model) throws Throwable {
        Project project = (Project) projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        model.addAttribute("project", project);
        model.addAttribute("allUsers", userService.getAllUsers());
        return "projects/members";
    }

    @PostMapping("/{id}/members/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String addMember(@PathVariable Long id, @RequestParam Long userId) throws Throwable {
        Project project = (Project) projectService.getProjectById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        User user = (User) userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        projectService.addMemberToProject(project, user);

        return "redirect:/projects/" + id + "/members";
    }

    @PostMapping("/{id}/members/remove")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String removeMember(@PathVariable Long id, @RequestParam Long userId) throws Throwable {
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
    }
}