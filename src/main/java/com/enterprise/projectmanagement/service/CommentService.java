package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Comment;
import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List getAllComments() {
        return commentRepository.findAll();
    }

    public Optional getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public List getCommentsByIssue(Issue issue) {
        return commentRepository.findByIssue(issue);
    }

    public List getCommentsByUser(User user) {
        return commentRepository.findByUser(user);
    }

    @Transactional
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment updateComment(Comment comment) {
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}