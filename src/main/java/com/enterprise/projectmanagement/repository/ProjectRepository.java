package com.enterprise.projectmanagement.repository;

import com.enterprise.projectmanagement.model.Project;
import com.enterprise.projectmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByKey(String key);
    List<Project> findByLead(User lead);
    List<Project> findByMembersContaining(User member);
    boolean existsByKey(String key);
}