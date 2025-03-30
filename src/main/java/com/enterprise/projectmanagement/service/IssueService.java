package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.Sprint;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IssueService {
    private final IssueRepository issueRepository;

    @Autowired
    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    public List getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public Optional getIssueByKey(String issueKey) {
        return issueRepository.findByIssueKey(issueKey);
    }

    public List getIssuesByProject(Project project) {
        return issueRepository.findByProject(project);
    }

    public List getIssuesByAssignee(User assignee) {
        return issueRepository.findByAssignee(assignee);
    }

    public List getIssuesByReporter(User reporter) {
        return issueRepository.findByReporter(reporter);
    }

    public List getIssuesBySprint(Sprint sprint) {
        return issueRepository.findBySprint(sprint);
    }

    public List getIssuesByProjectAndStatus(Project project, Issue.IssueStatus status) {
        return issueRepository.findByProjectAndStatus(project, status);
    }

    public List getIssuesBySprintAndStatus(Sprint sprint, Issue.IssueStatus status) {
        return issueRepository.findBySprintAndStatus(sprint, status);
    }

    @Transactional
    public Issue createIssue(Issue issue) {
        // Generate issue key if not provided
        if (issue.getIssueKey() == null || issue.getIssueKey().isEmpty()) {
            String projectKey = issue.getProject().getKey();
            Long issueCount = Long.valueOf(issueRepository.findByProject(issue.getProject()).size() + 1);
            issue.setIssueKey(projectKey + "-" + issueCount);
        }

        return issueRepository.save(issue);
    }

    @Transactional
    public Issue updateIssue(Issue issue) {
        issue.setUpdatedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    @Transactional
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    @Transactional
    public Issue assignToSprint(Issue issue, Sprint sprint) {
        issue.setSprint(sprint);
        issue.setUpdatedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    @Transactional
    public Issue assignToUser(Issue issue, User assignee) {
        issue.setAssignee(assignee);
        issue.setUpdatedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    @Transactional
    public Issue updateStatus(Issue issue, Issue.IssueStatus status) {
        issue.setStatus(status);
        issue.setUpdatedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    @Transactional
    public Issue updatePriority(Issue issue, Issue.IssuePriority priority) {
        issue.setPriority(priority);
        issue.setUpdatedAt(LocalDateTime.now());
        return issueRepository.save(issue);
    }

    public boolean existsByIssueKey(String issueKey) {
        return issueRepository.existsByIssueKey(issueKey);
    }
}