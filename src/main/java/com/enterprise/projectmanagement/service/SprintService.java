package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.Sprint;
import com.enterprise.projectmanagement.repository.IssueRepository;
import com.enterprise.projectmanagement.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SprintService {
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;

    @Autowired
    public SprintService(SprintRepository sprintRepository, IssueRepository issueRepository) {
        this.sprintRepository = sprintRepository;
        this.issueRepository = issueRepository;
    }

    public List getAllSprints() {
        return sprintRepository.findAll();
    }

    public Optional getSprintById(Long id) {
        return sprintRepository.findById(id);
    }

    public List getSprintsByProject(Project project) {
        return sprintRepository.findByProject(project);
    }

    public List getSprintsByProjectAndStatus(Project project, Sprint.SprintStatus status) {
        return sprintRepository.findByProjectAndStatus(project, status);
    }

    @Transactional
    public Sprint createSprint(Sprint sprint) {
        Project project = sprint.getProject();
        if (project == null || project.getType() != Project.ProjectType.SCRUM) {
            throw new IllegalArgumentException("Sprints can only be created for SCRUM projects");
        }
        return sprintRepository.save(sprint);
    }

    @Transactional
    public Sprint updateSprint(Sprint sprint) {
        sprint.setUpdatedAt(LocalDateTime.now());
        return sprintRepository.save(sprint);
    }

    @Transactional
    public void deleteSprint(Long id) {
        sprintRepository.deleteById(id);
    }

    @Transactional
    public Sprint startSprint(Sprint sprint) {
        sprint.setStatus(Sprint.SprintStatus.ACTIVE);
        sprint.setUpdatedAt(LocalDateTime.now());
        return sprintRepository.save(sprint);
    }

    @Transactional
    public Sprint completeSprint(Sprint sprint) {
        sprint.setStatus(Sprint.SprintStatus.COMPLETED);
        sprint.setUpdatedAt(LocalDateTime.now());
        return sprintRepository.save(sprint);
    }

    @Transactional
    public void addIssueToSprint(Sprint sprint, Issue issue) {
        issue.setSprint(sprint);
        issueRepository.save(issue);
    }

    @Transactional
    public void removeIssueFromSprint(Issue issue) {
        issue.setSprint(null);
        issueRepository.save(issue);
    }
}