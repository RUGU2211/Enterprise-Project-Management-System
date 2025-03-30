package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Optional getProjectByKey(String key) {
        return projectRepository.findByKey(key);
    }

    public List getProjectsByLead(User lead) {
        return projectRepository.findByLead(lead);
    }

    public List getProjectsByMember(User member) {
        return projectRepository.findByMembersContaining(member);
    }

    @Transactional
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Project project) {
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Transactional
    public void addMemberToProject(Project project, User user) {
        project.getMembers().add(user);
        projectRepository.save(project);
    }

    @Transactional
    public void removeMemberFromProject(Project project, User user) {
        project.getMembers().remove(user);
        projectRepository.save(project);
    }

    public boolean existsByKey(String key) {
        return projectRepository.existsByKey(key);
    }

    public List getUserProjects(User user) {
        // Get projects where user is either lead or member
        List leadProjects = projectRepository.findByLead(user);
        List memberProjects = projectRepository.findByMembersContaining(user);

        // Combine both lists and remove duplicates
        return (List) Stream.concat(leadProjects.stream(), memberProjects.stream())
                .distinct()
                .collect(Collectors.toList());
    }
}