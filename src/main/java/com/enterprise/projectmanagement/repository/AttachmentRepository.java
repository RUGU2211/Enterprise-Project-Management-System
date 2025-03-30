package com.enterprise.projectmanagement.repository;

import com.enterprise.projectmanagement.model.Attachment;
import com.enterprise.projectmanagement.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByIssue(Issue issue);
}