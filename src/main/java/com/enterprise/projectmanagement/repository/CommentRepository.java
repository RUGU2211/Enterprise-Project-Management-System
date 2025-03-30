package com.enterprise.projectmanagement.repository;

import com.enterprise.projectmanagement.model.Comment;
import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByIssue(Issue issue);
    List<Comment> findByUser(User user);
}