package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendIssueAssignmentEmail(Issue issue, User assignee) throws MessagingException {
        String subject = "You've been assigned to issue: " + issue.getIssueKey();

        Map variables = new HashMap<>();
        variables.put("assignee", assignee);
        variables.put("issue", issue);
        variables.put("issueUrl", "/issues/" + issue.getIssueKey());

        String content = processTemplate("issue-assignment", variables);

        sendEmail(assignee.getEmail(), subject, content);
    }

    public void sendIssueStatusUpdateEmail(Issue issue) throws MessagingException {
        if (issue.getAssignee() == null) {
            return;
        }

        String subject = "Status updated for issue: " + issue.getIssueKey();

        Map variables = new HashMap<>();
        variables.put("issue", issue);
        variables.put("issueUrl", "/issues/" + issue.getIssueKey());

        String content = processTemplate("issue-status-update", variables);

        sendEmail(issue.getAssignee().getEmail(), subject, content);
    }

    public void sendNewCommentEmail(Issue issue, User commentAuthor) throws MessagingException {
        if (issue.getAssignee() == null || issue.getAssignee().equals(commentAuthor)) {
            return;
        }

        String subject = "New comment on issue: " + issue.getIssueKey();

        Map variables = new HashMap<>();
        variables.put("issue", issue);
        variables.put("commentAuthor", commentAuthor);
        variables.put("issueUrl", "/issues/" + issue.getIssueKey() + "#comments");

        String content = processTemplate("new-comment", variables);

        sendEmail(issue.getAssignee().getEmail(), subject, content);
    }

    private String processTemplate(String templateName, Map variables) {
        Context context = new Context();
        variables.forEach((key, value) -> context.setVariable(key.toString(), value));

        return templateEngine.process(templateName, context);
    }

    private void sendEmail(String to, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
}