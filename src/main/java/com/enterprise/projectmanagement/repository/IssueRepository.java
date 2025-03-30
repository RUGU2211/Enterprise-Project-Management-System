package com.enterprise.projectmanagement.repository;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.Sprint;
import com.enterprise.projectmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByIssueKey(String issueKey);
    List<Issue> findByProject(Project project);
    List<Issue> findByAssignee(User assignee);
    List<Issue> findByReporter(User reporter);
    List<Issue> findBySprint(Sprint sprint);
    List<Issue> findByProjectAndStatus(Project project, Issue.IssueStatus status);
    List<Issue> findBySprintAndStatus(Sprint sprint, Issue.IssueStatus status);
    boolean existsByIssueKey(String issueKey);
}