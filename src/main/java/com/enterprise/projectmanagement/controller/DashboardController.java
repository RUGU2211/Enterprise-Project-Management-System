package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.IssueService;
import com.enterprise.projectmanagement.service.ProjectService;
import com.enterprise.projectmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {

    private final UserService userService;
    private final ProjectService projectService;
    private final IssueService issueService;

    @Autowired
    public DashboardController(UserService userService,
                               ProjectService projectService,
                               IssueService issueService) {
        this.userService = userService;
        this.projectService = projectService;
        this.issueService = issueService;
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) throws Throwable {
        // Get current user
        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user's projects
        List userProjects = projectService.getUserProjects(currentUser);

        // Get issues assigned to user
        List assignedIssues = issueService.getIssuesByAssignee(currentUser);

        // Get issues reported by user
        List reportedIssues = issueService.getIssuesByReporter(currentUser);

        model.addAttribute("user", currentUser);
        model.addAttribute("userProjects", userProjects);
        model.addAttribute("assignedIssues", assignedIssues);
        model.addAttribute("reportedIssues", reportedIssues);

        return "dashboard/index";
    }
}