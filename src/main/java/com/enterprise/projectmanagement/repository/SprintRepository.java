package com.enterprise.projectmanagement.repository;

import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProject(Project project);
    List<Sprint> findByProjectAndStatus(Project project, Sprint.SprintStatus status);
}