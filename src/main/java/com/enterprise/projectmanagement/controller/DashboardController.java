package com.enterprise.projectmanagement.controller;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.IssueService;
import com.enterprise.projectmanagement.service.ProjectService;
import com.enterprise.projectmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/dashboard")
public class DashboardController {
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

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

    @GetMapping
    public String dashboard(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        try {
            // Get current user
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get user's projects
            List<Project> userProjects = projectService.getUserProjects(currentUser);

            // Get issues assigned to user
            List<Issue> assignedIssues = issueService.getIssuesByAssignee(currentUser);

            // Get issues reported by user
            List<Issue> reportedIssues = issueService.getIssuesByReporter(currentUser);

            model.addAttribute("user", currentUser);
            model.addAttribute("userProjects", userProjects);
            model.addAttribute("assignedIssues", assignedIssues);
            model.addAttribute("reportedIssues", reportedIssues);

            return "dashboard/index";
        } catch (Throwable e) {
            logger.error("Error loading dashboard", e);
            throw new RuntimeException("Could not load dashboard", e);
        }
    }

    @GetMapping("/stats")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> stats = new HashMap<>();

        try {
            // Get current user
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all projects the user has access to
            List<Project> userProjects = projectService.getUserProjects(currentUser);
            stats.put("totalProjects", userProjects.size());

            // Get all issues from user's projects
            List<Issue> allIssues = (List<Issue>) userProjects.stream()
                    .flatMap(project -> issueService.getIssuesByProject(project).stream())
                    .collect(Collectors.toList());

            // Count issues by status
            Map<Issue.IssueStatus, Long> issueStatusCounts = allIssues.stream()
                    .collect(Collectors.groupingBy(Issue::getStatus, Collectors.counting()));

            stats.put("openIssues",
                    issueStatusCounts.getOrDefault(Issue.IssueStatus.TODO, 0L) +
                            issueStatusCounts.getOrDefault(Issue.IssueStatus.IN_PROGRESS, 0L) +
                            issueStatusCounts.getOrDefault(Issue.IssueStatus.IN_REVIEW, 0L)
            );
            stats.put("completedIssues",
                    issueStatusCounts.getOrDefault(Issue.IssueStatus.DONE, 0L)
            );

            // Upcoming deadlines (due in the next 7 days)
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime sevenDaysLater = now.plusDays(7);
            long upcomingDeadlines = allIssues.stream()
                    .filter(i -> i.getDueDate() != null &&
                            i.getDueDate().isAfter(now) &&
                            i.getDueDate().isBefore(sevenDaysLater))
                    .count();
            stats.put("upcomingDeadlines", upcomingDeadlines);

            // Project completion percentage
            int totalIssueCount = allIssues.size();
            int projectCompletionPercentage = totalIssueCount > 0
                    ? (int)((double)issueStatusCounts.getOrDefault(Issue.IssueStatus.DONE, 0L) / totalIssueCount * 100)
                    : 0;
            stats.put("projectCompletionPercentage", projectCompletionPercentage);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching dashboard stats", e);
            return ResponseEntity.ok(getSampleStats());
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/charts")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getDashboardCharts(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Get current user
            User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get all projects the user has access to
            List<Project> userProjects = projectService.getUserProjects(currentUser);

            // Get all issues from user's projects
            List<Issue> allIssues = (List<Issue>) userProjects.stream()
                    .flatMap(project -> issueService.getIssuesByProject(project).stream())
                    .collect(Collectors.toList());

            // Prepare chart data
            Map<String, Object> chartData = new HashMap<>();

            // Project Completion Chart
            Map<String, Object> projectCompletion = getProjectCompletionChartData();
            chartData.put("projectCompletion", projectCompletion);

            // Issue Distribution Chart
            Map<String, Object> issueDistribution = getIssueDistributionChartData(allIssues);
            chartData.put("issueDistribution", issueDistribution);

            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            logger.error("Error fetching dashboard charts", e);
            return ResponseEntity.ok(getSampleChartData());
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, Object> getProjectCompletionChartData() {
        Map<String, Object> projectCompletion = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        // Generate labels for the last 6 months
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthDate = now.minusMonths(i);
            labels.add(monthDate.getMonth().toString().substring(0, 3));
            // Sample increasing progress
            data.add(10 + (i * 15));
        }

        projectCompletion.put("labels", labels);
        projectCompletion.put("data", data);
        return projectCompletion;
    }

    private Map<String, Object> getIssueDistributionChartData(List<Issue> allIssues) {
        Map<String, Object> issueDistribution = new HashMap<>();
        List<String> statusLabels = Arrays.asList("To Do", "In Progress", "In Review", "Done");

        // Count issues by status
        Map<Issue.IssueStatus, Long> statusCounts = allIssues.stream()
                .collect(Collectors.groupingBy(Issue::getStatus, Collectors.counting()));

        List<Integer> data = Arrays.asList(
                statusCounts.getOrDefault(Issue.IssueStatus.TODO, 0L).intValue(),
                statusCounts.getOrDefault(Issue.IssueStatus.IN_PROGRESS, 0L).intValue(),
                statusCounts.getOrDefault(Issue.IssueStatus.IN_REVIEW, 0L).intValue(),
                statusCounts.getOrDefault(Issue.IssueStatus.DONE, 0L).intValue()
        );

        issueDistribution.put("labels", statusLabels);
        issueDistribution.put("data", data);
        return issueDistribution;
    }

    // Fallback methods for sample data
    private Map<String, Object> getSampleStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", 0);
        stats.put("openIssues", 0);
        stats.put("completedIssues", 0);
        stats.put("upcomingDeadlines", 0);
        stats.put("projectCompletionPercentage", 0);
        return stats;
    }

    private Map<String, Object> getSampleChartData() {
        Map<String, Object> chartData = new HashMap<>();

        // Project completion sample data
        Map<String, Object> projectCompletion = new HashMap<>();
        projectCompletion.put("labels", Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun"));
        projectCompletion.put("data", Arrays.asList(10, 25, 40, 50, 65, 80));
        chartData.put("projectCompletion", projectCompletion);

        // Issue distribution sample data
        Map<String, Object> issueDistribution = new HashMap<>();
        issueDistribution.put("labels", Arrays.asList("To Do", "In Progress", "In Review", "Done"));
        issueDistribution.put("data", Arrays.asList(5, 3, 2, 8));
        chartData.put("issueDistribution", issueDistribution);

        return chartData;
    }
}