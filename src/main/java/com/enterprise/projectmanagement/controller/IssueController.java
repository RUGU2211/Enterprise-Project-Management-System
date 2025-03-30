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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/issues")
public class IssueController {

    private final IssueService issueService;
    private final ProjectService projectService;
    private final UserService userService;
    private final CommentService commentService;
    private final AttachmentService attachmentService;
    private final SprintService sprintService;

    @Autowired
    public IssueController(IssueService issueService,
                           ProjectService projectService,
                           UserService userService,
                           CommentService commentService,
                           AttachmentService attachmentService,
                           SprintService sprintService) {
        this.issueService = issueService;
        this.projectService = projectService;
        this.userService = userService;
        this.commentService = commentService;
        this.attachmentService = attachmentService;
        this.sprintService = sprintService;
    }

    @GetMapping("/assigned")
    public String getAssignedIssues(@AuthenticationPrincipal UserDetails userDetails,
                                    Model model,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) String priority,
                                    @RequestParam(required = false) String type,
                                    @RequestParam(required = false) Long projectId,
                                    @RequestParam(required = false) String search) throws Throwable {

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Issue> issues = issueService.getIssuesByAssignee(currentUser);

        // Apply filters
        issues = filterIssues(issues, status, priority, type, projectId, search);

        model.addAttribute("issues", issues);
        model.addAttribute("view", "assigned");
        addFilterAttributes(model, currentUser);

        return "issues/list";
    }

    @GetMapping("/reported")
    public String getReportedIssues(@AuthenticationPrincipal UserDetails userDetails,
                                    Model model,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) String priority,
                                    @RequestParam(required = false) String type,
                                    @RequestParam(required = false) Long projectId,
                                    @RequestParam(required = false) String search) throws Throwable {

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Issue> issues = issueService.getIssuesByReporter(currentUser);

        // Apply filters
        issues = filterIssues(issues, status, priority, type, projectId, search);

        model.addAttribute("issues", issues);
        model.addAttribute("view", "reported");
        addFilterAttributes(model, currentUser);

        return "issues/list";
    }

    @GetMapping("/{issueKey}")
    public String getIssueDetails(@PathVariable String issueKey,
                                  Model model,
                                  @AuthenticationPrincipal UserDetails userDetails) throws Throwable {
        Issue issue = (Issue) issueService.getIssueByKey(issueKey)
                .orElseThrow(() -> new RuntimeException("Issue not found with key: " + issueKey));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Comment> comments = commentService.getCommentsByIssue(issue);
        List<Attachment> attachments = attachmentService.getAttachmentsByIssue(issue);

        model.addAttribute("issue", issue);
        model.addAttribute("comments", comments);
        model.addAttribute("attachments", attachments);
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("statuses", Arrays.asList(Issue.IssueStatus.values()));

        return "issues/details";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) throws Throwable {
        Issue issue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        Project project = issue.getProject();
        List<User> projectMembers = (List<User>) project.getMembers().stream().collect(Collectors.toList());
        List<Sprint> sprints = sprintService.getSprintsByProject(project);

        model.addAttribute("issue", issue);
        model.addAttribute("projectMembers", projectMembers);
        model.addAttribute("sprints", sprints);
        model.addAttribute("issueTypes", Arrays.asList(Issue.IssueType.values()));
        model.addAttribute("priorities", Arrays.asList(Issue.IssuePriority.values()));
        model.addAttribute("statuses", Arrays.asList(Issue.IssueStatus.values()));

        return "issues/edit";
    }

    @PostMapping("/{id}")
    public String updateIssue(@PathVariable Long id,
                              @Valid @ModelAttribute Issue issue,
                              BindingResult result,
                              Model model) throws Throwable {

        if (result.hasErrors()) {
            Project project = issue.getProject();
            List<User> projectMembers = (List<User>) project.getMembers().stream().collect(Collectors.toList());
            List<Sprint> sprints = sprintService.getSprintsByProject(project);

            model.addAttribute("projectMembers", projectMembers);
            model.addAttribute("sprints", sprints);
            model.addAttribute("issueTypes", Arrays.asList(Issue.IssueType.values()));
            model.addAttribute("priorities", Arrays.asList(Issue.IssuePriority.values()));
            model.addAttribute("statuses", Arrays.asList(Issue.IssueStatus.values()));

            return "issues/edit";
        }

        Issue existingIssue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        // Update fields
        existingIssue.setTitle(issue.getTitle());
        existingIssue.setDescription(issue.getDescription());
        existingIssue.setType(issue.getType());
        existingIssue.setPriority(issue.getPriority());
        existingIssue.setStatus(issue.getStatus());
        existingIssue.setAssignee(issue.getAssignee());
        existingIssue.setSprint(issue.getSprint());
        existingIssue.setStoryPoints(issue.getStoryPoints());

        issueService.updateIssue(existingIssue);

        return "redirect:/issues/" + existingIssue.getIssueKey();
    }

    @PostMapping("/{id}/status")
    @ResponseBody
    public String updateStatus(@PathVariable Long id, @RequestParam Issue.IssueStatus status) throws Throwable {
        Issue issue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        issueService.updateStatus(issue, status);

        return "success";
    }

    @PostMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROJECT_MANAGER')")
    public String deleteIssue(@PathVariable Long id) throws Throwable {
        Issue issue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        Project project = issue.getProject();

        issueService.deleteIssue(id);

        return "redirect:/projects/" + project.getId();
    }

    @PostMapping("/{id}/comments")
    public String addComment(@PathVariable Long id,
                             @RequestParam String content,
                             @AuthenticationPrincipal UserDetails userDetails) throws Throwable {

        Issue issue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setIssue(issue);
        comment.setUser(currentUser);

        commentService.createComment(comment);

        return "redirect:/issues/" + issue.getIssueKey() + "#comments";
    }

    @PostMapping("/comments/{commentId}/edit")
    public String updateComment(@PathVariable Long commentId,
                                @RequestParam String content,
                                @AuthenticationPrincipal UserDetails userDetails) throws Throwable {

        Comment comment = (Comment) commentService.getCommentById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Security check - only the author can edit their comment
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to edit this comment");
        }

        comment.setContent(content);
        commentService.updateComment(comment);

        return "redirect:/issues/" + comment.getIssue().getIssueKey() + "#comments";
    }

    @PostMapping("/comments/{commentId}/delete")
    public String deleteComment(@PathVariable Long commentId,
                                @AuthenticationPrincipal UserDetails userDetails) throws Throwable {

        Comment comment = (Comment) commentService.getCommentById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Security check - only the author or project lead/admin can delete a comment
        if (!comment.getUser().getId().equals(currentUser.getId()) &&
                !comment.getIssue().getProject().getLead().getId().equals(currentUser.getId()) &&
                !currentUser.getRoles().stream().anyMatch(r -> ((Role)r).getName().equals("ADMIN"))) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        String issueKey = comment.getIssue().getIssueKey();

        commentService.deleteComment(commentId);

        return "redirect:/issues/" + issueKey + "#comments";
    }

    @PostMapping("/{id}/attachments")
    public String addAttachment(@PathVariable Long id,
                                @RequestParam("file") MultipartFile file,
                                @AuthenticationPrincipal UserDetails userDetails,
                                RedirectAttributes redirectAttributes) throws Throwable {

        Issue issue = (Issue) issueService.getIssueById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            attachmentService.storeAttachment(file, issue, currentUser);
            redirectAttributes.addFlashAttribute("message", "File uploaded successfully");
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("error", "Failed to upload file: " + e.getMessage());
        }

        return "redirect:/issues/" + issue.getIssueKey() + "#attachments";
    }

    @GetMapping("/attachments/{id}/download")
    public String downloadAttachment(@PathVariable Long id) throws Throwable {
        Attachment attachment = (Attachment) attachmentService.getAttachmentById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        // Implement file download logic here
        // This would typically involve setting Content-Disposition headers and streaming the file

        return "redirect:/issues/" + attachment.getIssue().getIssueKey();
    }

    @PostMapping("/attachments/{id}/delete")
    public String deleteAttachment(@PathVariable Long id,
                                   @AuthenticationPrincipal UserDetails userDetails) throws Throwable {

        Attachment attachment = (Attachment) attachmentService.getAttachmentById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        User currentUser = (User) userService.getUserByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Security check - only the uploader or project lead/admin can delete an attachment
        if (!attachment.getUploadedBy().getId().equals(currentUser.getId()) &&
                !attachment.getIssue().getProject().getLead().getId().equals(currentUser.getId()) &&
                !currentUser.getRoles().stream().anyMatch(r -> ((Role)r).getName().equals("ADMIN"))) {
            throw new RuntimeException("You are not authorized to delete this attachment");
        }

        String issueKey = attachment.getIssue().getIssueKey();

        try {
            attachmentService.deleteAttachment(id);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete attachment: " + e.getMessage());
        }

        return "redirect:/issues/" + issueKey + "#attachments";
    }

    /* Helper methods */

    private List<Issue> filterIssues(List<Issue> issues, String status, String priority, String type, Long projectId, String search) {
        // Apply status filter
        if (status != null && !status.isEmpty()) {
            Issue.IssueStatus statusEnum = Issue.IssueStatus.valueOf(status);
            issues = issues.stream()
                    .filter(issue -> issue.getStatus() == statusEnum)
                    .collect(Collectors.toList());
        }

        // Apply priority filter
        if (priority != null && !priority.isEmpty()) {
            Issue.IssuePriority priorityEnum = Issue.IssuePriority.valueOf(priority);
            issues = issues.stream()
                    .filter(issue -> issue.getPriority() == priorityEnum)
                    .collect(Collectors.toList());
        }

        // Apply type filter
        if (type != null && !type.isEmpty()) {
            Issue.IssueType typeEnum = Issue.IssueType.valueOf(type);
            issues = issues.stream()
                    .filter(issue -> issue.getType() == typeEnum)
                    .collect(Collectors.toList());
        }

        // Apply project filter
        if (projectId != null) {
            issues = issues.stream()
                    .filter(issue -> issue.getProject().getId().equals(projectId))
                    .collect(Collectors.toList());
        }

        // Apply search filter
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            issues = issues.stream()
                    .filter(issue ->
                            issue.getTitle().toLowerCase().contains(searchLower) ||
                                    issue.getIssueKey().toLowerCase().contains(searchLower) ||
                                    (issue.getDescription() != null && issue.getDescription().toLowerCase().contains(searchLower))
                    )
                    .collect(Collectors.toList());
        }

        return issues;
    }

    private void addFilterAttributes(Model model, User currentUser) {
        model.addAttribute("statuses", Arrays.asList(Issue.IssueStatus.values()));
        model.addAttribute("priorities", Arrays.asList(Issue.IssuePriority.values()));
        model.addAttribute("issueTypes", Arrays.asList(Issue.IssueType.values()));

        // Get all projects the user is involved in
        List<Project> projects = projectService.getUserProjects(currentUser);
        model.addAttribute("projects", projects);
    }
}