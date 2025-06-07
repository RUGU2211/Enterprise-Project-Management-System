package com.example.project_management_tool.services;

import com.example.project_management_tool.domain.Project;
import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.User;

public interface EmailService {
    void sendTeamInvitation(Team team, User user);
    void sendProjectAssignment(Project project, User user);
    void sendTaskAssignment(String taskName, User user);
    void sendDeadlineReminder(String subject, String content, User user);
    void sendStatusUpdate(String subject, String content, User user);
    void sendWelcomeEmail(User user);
} 