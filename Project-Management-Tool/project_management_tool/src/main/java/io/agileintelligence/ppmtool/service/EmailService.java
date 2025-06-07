package io.agileintelligence.ppmtool.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails as notifications
 * Can be used for team invitations, project assignments, etc.
 */
@Service
public class EmailService {
    
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender mailSender;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Sends a simple email notification
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        
        try {
            log.info("Sending email to: {} with subject: {}", to, subject);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to: {} with subject: {}", to, subject, e);
        }
    }

    /**
     * Send task assignment notification
     * @param to recipient email address
     * @param taskSummary summary of the task
     * @param projectName name of the project
     * @param assignedBy name of the user who assigned the task
     */
    public void sendTaskAssignmentNotification(String to, String taskSummary, String projectName, String assignedBy) {
        String subject = "New Task Assigned: " + taskSummary;
        String body = String.format(
            "Hello,\n\n" +
            "You have been assigned a new task in the project '%s'.\n\n" +
            "Task Summary: %s\n" +
            "Assigned By: %s\n\n" +
            "Please log in to the Project Management Tool to view more details and update the task status.\n\n" +
            "Best Regards,\n" +
            "Project Management Team",
            projectName, taskSummary, assignedBy
        );
        
        sendSimpleMessage(to, subject, body);
    }

    /**
     * Send task status update notification
     * @param to recipient email address
     * @param taskSummary summary of the task
     * @param projectName name of the project
     * @param status new status of the task
     * @param updatedBy name of the user who updated the task
     */
    public void sendTaskStatusUpdateNotification(String to, String taskSummary, String projectName, String status, String updatedBy) {
        String subject = "Task Status Updated: " + taskSummary;
        String body = String.format(
            "Hello,\n\n" +
            "A task you're involved with has been updated in the project '%s'.\n\n" +
            "Task Summary: %s\n" +
            "New Status: %s\n" +
            "Updated By: %s\n\n" +
            "Please log in to the Project Management Tool to view more details.\n\n" +
            "Best Regards,\n" +
            "Project Management Team",
            projectName, taskSummary, status, updatedBy
        );
        
        sendSimpleMessage(to, subject, body);
    }

    /**
     * Send comment notification
     * @param to recipient email address
     * @param taskSummary summary of the task
     * @param projectName name of the project
     * @param commenterName name of the user who commented
     * @param comment the comment text
     */
    public void sendCommentNotification(String to, String taskSummary, String projectName, String commenterName, String comment) {
        String subject = "New Comment on Task: " + taskSummary;
        String body = String.format(
            "Hello,\n\n" +
            "A new comment has been added to a task you're involved with in the project '%s'.\n\n" +
            "Task Summary: %s\n" +
            "Commented By: %s\n" +
            "Comment: %s\n\n" +
            "Please log in to the Project Management Tool to view the full discussion and respond.\n\n" +
            "Best Regards,\n" +
            "Project Management Team",
            projectName, taskSummary, commenterName, comment
        );
        
        sendSimpleMessage(to, subject, body);
    }

    /**
     * Send project deadline notification
     * @param to recipient email address
     * @param projectName name of the project
     * @param daysRemaining days remaining until the deadline
     */
    public void sendProjectDeadlineNotification(String to, String projectName, int daysRemaining) {
        String subject = "Project Deadline Approaching: " + projectName;
        String body = String.format(
            "Hello,\n\n" +
            "This is a reminder that the project '%s' is approaching its deadline.\n\n" +
            "Days Remaining: %d\n\n" +
            "Please log in to the Project Management Tool to review the project status and ensure all tasks are on track.\n\n" +
            "Best Regards,\n" +
            "Project Management Team",
            projectName, daysRemaining
        );
        
        sendSimpleMessage(to, subject, body);
    }
} 