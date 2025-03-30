package com.enterprise.projectmanagement.aop;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.User;
import com.enterprise.projectmanagement.service.EmailService;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;

@Aspect
@Component
public class EmailNotificationAspect {

    private final EmailService emailService;

    @Autowired
    public EmailNotificationAspect(EmailService emailService) {
        this.emailService = emailService;
    }

    @AfterReturning(
            pointcut = "execution(* com.enterprise.projectmanagement.service.IssueService.assignToUser(..))",
            returning = "issue")
    public void afterIssueAssignment(Issue issue) {
        try {
            if (issue.getAssignee() != null) {
                emailService.sendIssueAssignmentEmail(issue, issue.getAssignee());
            }
        } catch (MessagingException e) {
            // Log exception but don't disrupt the main flow
            e.printStackTrace();
        }
    }

    @AfterReturning(
            pointcut = "execution(* com.enterprise.projectmanagement.service.IssueService.updateStatus(..))",
            returning = "issue")
    public void afterStatusUpdate(Issue issue) {
        try {
            emailService.sendIssueStatusUpdateEmail(issue);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @AfterReturning(
            pointcut = "execution(* com.enterprise.projectmanagement.service.CommentService.createComment(..))",
            returning = "comment")
    public void afterCommentCreation(com.enterprise.projectmanagement.model.Comment comment) {
        try {
            emailService.sendNewCommentEmail(comment.getIssue(), comment.getUser());
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}