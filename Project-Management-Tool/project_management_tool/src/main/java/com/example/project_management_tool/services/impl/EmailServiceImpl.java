package com.example.project_management_tool.services.impl;

import com.example.project_management_tool.domain.Project;
import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Async
    @Override
    public void sendTeamInvitation(Team team, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("team", team);
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("team-invitation", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject("Team Invitation: " + team.getName());
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent team invitation email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send team invitation email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendProjectAssignment(Project project, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("project", project);
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("project-assignment", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject("New Project Assignment: " + project.getProjectName());
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent project assignment email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send project assignment email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendTaskAssignment(String taskName, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("taskName", taskName);
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("task-assignment", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject("New Task Assignment: " + taskName);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent task assignment email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send task assignment email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendDeadlineReminder(String subject, String content, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("content", content);
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("deadline-reminder", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent deadline reminder email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send deadline reminder email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendStatusUpdate(String subject, String content, User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("content", content);
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("status-update", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent status update email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send status update email to {}: {}", user.getEmail(), e.getMessage(), e);
        }
    }

    @Async
    @Override
    public void sendWelcomeEmail(User user) {
        try {
            logger.info("Preparing welcome email for user: {}", user.getEmail());
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            Context context = new Context(Locale.getDefault());
            context.setVariable("user", user);
            
            String htmlContent = templateEngine.process("welcome", context);
            
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Project Management Tool");
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Successfully sent welcome email to {}", user.getEmail());
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
} 