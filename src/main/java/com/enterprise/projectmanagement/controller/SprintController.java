package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.*;
import com.enterprise.projectmanagement.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/projects/{projectId}/sprints")
public class SprintController {

    private final SprintService sprintService;
    private final ProjectService projectService;
    private final IssueService issueService;
    private final UserService userService;

    @Autowired
    public SprintController(SprintService sprintService,
                            ProjectService projectService,
                            IssueService issueService,
                            UserService userService) {
        this.sprintService = sprintService;
        this.projectService = projectService;
        this.issueService = issueService;
        this.userService = userService;
    }

    @GetMapping
    public String getAllSprints(@PathVariable Long projectId, Model model) throws Throwable {
        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        List<Sprint> sprints = sprintService.getSprintsByProject(project);

        model.addAttribute("project", project);
        model.addAttribute("sprints", sprints);

        return "sprints/list";
    }

    @GetMapping("/{id}")
    public String getSprintDetails(@PathVariable Long projectId,
                                   @PathVariable Long id,
                                   Model model,
                                   @AuthenticationPrincipal UserDetails userDetails) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if sprint belongs to project
        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        // Get issues for each status
        Map<Issue.IssueStatus, List<Issue>> issuesByStatus = new HashMap<>();
        for (Issue.IssueStatus status : Issue.IssueStatus.values()) {
            List<Issue> issues = issueService.getIssuesBySprintAndStatus(sprint, status);
            issuesByStatus.put(status, issues);
        }

        // Calculate sprint progress
        int totalDays = (int) ChronoUnit.DAYS.between(sprint.getStartDate(), sprint.getEndDate()) + 1;
        int daysElapsed = 0;
        int sprintProgress = 0;

        if (sprint.getStatus() == Sprint.SprintStatus.ACTIVE) {
            daysElapsed = (int) ChronoUnit.DAYS.between(sprint.getStartDate(), LocalDate.now()) + 1;
            daysElapsed = Math.max(0, Math.min(daysElapsed, totalDays)); // Ensure within bounds
            sprintProgress = (int) ((double) daysElapsed / totalDays * 100);
        } else if (sprint.getStatus() == Sprint.SprintStatus.COMPLETED) {
            sprintProgress = 100;
        }

        // Calculate burndown data
        List<Issue> sprintIssues = issueService.getIssuesBySprint(sprint);
        int totalStoryPoints = sprintIssues.stream()
                .filter(i -> i.getStoryPoints() != null)
                .mapToInt(i -> i.getStoryPoints())
                .sum();

        int completedStoryPoints = sprintIssues.stream()
                .filter(i -> i.getStatus() == Issue.IssueStatus.DONE && i.getStoryPoints() != null)
                .mapToInt(i -> i.getStoryPoints())
                .sum();

        model.addAttribute("project", project);
        model.addAttribute("sprint", sprint);
        model.addAttribute("issuesByStatus", issuesByStatus);
        model.addAttribute("sprintProgress", sprintProgress);
        model.addAttribute("totalDays", totalDays);
        model.addAttribute("daysElapsed", daysElapsed);
        model.addAttribute("totalStoryPoints", totalStoryPoints);
        model.addAttribute("completedStoryPoints", completedStoryPoints);
        model.addAttribute("currentUser", currentUser);

        return "sprints/details";
    }

    @GetMapping("/new")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String showCreateForm(@PathVariable Long projectId, Model model) throws Throwable {
        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (project.getType() != Project.ProjectType.SCRUM) {
            throw new RuntimeException("Sprints are only available for Scrum projects");
        }

        // Check if there's already an active sprint
        List<Sprint> activeSprints = sprintService.getSprintsByProjectAndStatus(project, Sprint.SprintStatus.ACTIVE);
        if (!activeSprints.isEmpty()) {
            model.addAttribute("activeSprintExists", true);
            model.addAttribute("activeSprint", activeSprints.get(0));
        }

        Sprint sprint = new Sprint();
        sprint.setProject(project);
        sprint.setStatus(Sprint.SprintStatus.PLANNING);

        // Default sprint duration: 2 weeks
        LocalDate today = LocalDate.now();
        sprint.setStartDate(today);
        sprint.setEndDate(today.plusWeeks(2).minusDays(1));

        model.addAttribute("project", project);
        model.addAttribute("sprint", sprint);

        return "sprints/create";
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String createSprint(@PathVariable Long projectId,
                               @Valid @ModelAttribute Sprint sprint,
                               BindingResult result,
                               Model model) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (result.hasErrors()) {
            model.addAttribute("project", project);
            return "sprints/create";
        }

        // Validate sprint dates
        if (sprint.getEndDate().isBefore(sprint.getStartDate())) {
            result.rejectValue("endDate", "error.sprint", "End date must be after start date");
            model.addAttribute("project", project);
            return "sprints/create";
        }

        sprint.setProject(project);
        sprint.setStatus(Sprint.SprintStatus.PLANNING);

        sprintService.createSprint(sprint);

        return "redirect:/projects/" + projectId + "/sprints";
    }

    @GetMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String showEditForm(@PathVariable Long projectId,
                               @PathVariable Long id,
                               Model model) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        model.addAttribute("project", project);
        model.addAttribute("sprint", sprint);

        return "sprints/edit";
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String updateSprint(@PathVariable Long projectId,
                               @PathVariable Long id,
                               @Valid @ModelAttribute Sprint sprint,
                               BindingResult result,
                               Model model) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        if (result.hasErrors()) {
            model.addAttribute("project", project);
            return "sprints/edit";
        }

        Sprint existingSprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        if (!existingSprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        // Don't allow changing sprint dates if it's active
        if (existingSprint.getStatus() == Sprint.SprintStatus.ACTIVE) {
            if (!existingSprint.getStartDate().equals(sprint.getStartDate()) ||
                    !existingSprint.getEndDate().equals(sprint.getEndDate())) {
                result.rejectValue("startDate", "error.sprint", "Cannot change dates of an active sprint");
                model.addAttribute("project", project);
                return "sprints/edit";
            }
        }

        // Validate sprint dates
        if (sprint.getEndDate().isBefore(sprint.getStartDate())) {
            result.rejectValue("endDate", "error.sprint", "End date must be after start date");
            model.addAttribute("project", project);
            return "sprints/edit";
        }

        // Update fields
        existingSprint.setName(sprint.getName());
        existingSprint.setGoal(sprint.getGoal());
        existingSprint.setStartDate(sprint.getStartDate());
        existingSprint.setEndDate(sprint.getEndDate());

        sprintService.updateSprint(existingSprint);

        return "redirect:/projects/" + projectId + "/sprints/" + id;
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String startSprint(@PathVariable Long projectId,
                              @PathVariable Long id) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        if (sprint.getStatus() != Sprint.SprintStatus.PLANNING) {
            throw new RuntimeException("Only sprints in planning status can be started");
        }

        // Check if there's already an active sprint
        List<Sprint> activeSprints = sprintService.getSprintsByProjectAndStatus(project, Sprint.SprintStatus.ACTIVE);
        if (!activeSprints.isEmpty()) {
            throw new RuntimeException("Another sprint is already active");
        }

        // Start the sprint
        sprintService.startSprint(sprint);

        return "redirect:/projects/" + projectId + "/sprints/" + id;
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String completeSprint(@PathVariable Long projectId,
                                 @PathVariable Long id) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        if (sprint.getStatus() != Sprint.SprintStatus.ACTIVE) {
            throw new RuntimeException("Only active sprints can be completed");
        }

        // Complete the sprint
        sprintService.completeSprint(sprint);

        // Move incomplete issues back to backlog
        List<Issue> sprintIssues = issueService.getIssuesBySprint(sprint);
        for (Issue issue : sprintIssues) {
            if (issue.getStatus() != Issue.IssueStatus.DONE) {
                issue.setSprint(null);
                issueService.updateIssue(issue);
            }
        }

        return "redirect:/projects/" + projectId + "/sprints/" + id;
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String deleteSprint(@PathVariable Long projectId,
                               @PathVariable Long id) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));

        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        // Only allow deleting sprints in PLANNING status
        if (sprint.getStatus() != Sprint.SprintStatus.PLANNING) {
            throw new RuntimeException("Only sprints in planning status can be deleted");
        }

        // Move all issues back to backlog
        List<Issue> sprintIssues = issueService.getIssuesBySprint(sprint);
        for (Issue issue : sprintIssues) {
            issue.setSprint(null);
            issueService.updateIssue(issue);
        }

        sprintService.deleteSprint(id);

        return "redirect:/projects/" + projectId + "/sprints";
    }

    @GetMapping("/{sprintId}/backlog")
    public String getSprintBacklog(@PathVariable Long projectId,
                                   @PathVariable Long sprintId,
                                   Model model) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + sprintId));

        if (!sprint.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint does not belong to the specified project");
        }

        // Get issues in sprint
        List<Issue> sprintIssues = issueService.getIssuesBySprint(sprint);

        // Get backlog issues (issues without a sprint)
        List<Issue> backlogIssues = (List<Issue>) issueService.getIssuesByProject(project).stream()
                .filter(issue -> issue.toString() == null)
                .collect(Collectors.toList());

        model.addAttribute("project", project);
        model.addAttribute("sprint", sprint);
        model.addAttribute("sprintIssues", sprintIssues);
        model.addAttribute("backlogIssues", backlogIssues);

        return "sprints/backlog";
    }

    @PostMapping("/{sprintId}/issues/{issueId}/add")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String addIssueToSprint(@PathVariable Long projectId,
                                   @PathVariable Long sprintId,
                                   @PathVariable Long issueId) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + sprintId));

        Issue issue = (Issue) issueService.getIssueById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));

        if (!sprint.getProject().getId().equals(projectId) || !issue.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint or issue does not belong to the specified project");
        }

        sprintService.addIssueToSprint(sprint, issue);

        return "redirect:/projects/" + projectId + "/sprints/" + sprintId + "/backlog";
    }

    @PostMapping("/{sprintId}/issues/{issueId}/remove")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String removeIssueFromSprint(@PathVariable Long projectId,
                                        @PathVariable Long sprintId,
                                        @PathVariable Long issueId) throws Throwable {

        Project project = (Project) projectService.getProjectById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        Sprint sprint = (Sprint) sprintService.getSprintById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + sprintId));

        Issue issue = (Issue) issueService.getIssueById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));

        if (!sprint.getProject().getId().equals(projectId) || !issue.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Sprint or issue does not belong to the specified project");
        }

        if (issue.getSprint() == null || !issue.getSprint().getId().equals(sprintId)) {
            throw new RuntimeException("Issue is not part of this sprint");
        }

        sprintService.removeIssueFromSprint(issue);

        return "redirect:/projects/" + projectId + "/sprints/" + sprintId + "/backlog";
    }
}