-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS projectmanagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE projectmanagement;

-- Drop tables in correct order to avoid foreign key constraints
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS sprints;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------
-- Table `roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
                                       `id` BIGINT NOT NULL AUTO_INCREMENT,
                                       `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UK_roles_name` (`name`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
                                       `id` BIGINT NOT NULL AUTO_INCREMENT,
                                       `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `avatar_url` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UK_users_username` (`username`),
    UNIQUE INDEX `UK_users_email` (`email`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `user_roles` (Join table for many-to-many)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
                                            `user_id` BIGINT NOT NULL,
                                            `role_id` BIGINT NOT NULL,
                                            PRIMARY KEY (`user_id`, `role_id`),
    INDEX `FK_user_roles_role_id` (`role_id`),
    CONSTRAINT `FK_user_roles_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `FK_user_roles_role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `roles` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `projects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
                                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                                          `name` VARCHAR(100) NOT NULL,
    `key` VARCHAR(10) NOT NULL,
    `description` TEXT NULL,
    `lead_id` BIGINT NOT NULL,
    `type` ENUM('SCRUM', 'KANBAN') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UK_projects_key` (`key`),
    INDEX `FK_projects_lead_id` (`lead_id`),
    CONSTRAINT `FK_projects_lead_id`
    FOREIGN KEY (`lead_id`)
    REFERENCES `users` (`id`)
                                                              ON DELETE RESTRICT
                                                              ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `project_members` (Join table for many-to-many)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_members` (
                                                 `project_id` BIGINT NOT NULL,
                                                 `user_id` BIGINT NOT NULL,
                                                 PRIMARY KEY (`project_id`, `user_id`),
    INDEX `FK_project_members_user_id` (`user_id`),
    CONSTRAINT `FK_project_members_project_id`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `FK_project_members_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `sprints`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sprints` (
                                         `id` BIGINT NOT NULL AUTO_INCREMENT,
                                         `name` VARCHAR(100) NOT NULL,
    `goal` TEXT NULL,
    `project_id` BIGINT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` ENUM('PLANNING', 'ACTIVE', 'COMPLETED') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `FK_sprints_project_id` (`project_id`),
    INDEX `IDX_sprints_status` (`status`),
    CONSTRAINT `FK_sprints_project_id`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`)
                                                              ON DELETE CASCADE
                                                              ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `issues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `issues` (
                                        `id` BIGINT NOT NULL AUTO_INCREMENT,
                                        `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `issue_key` VARCHAR(20) NOT NULL,
    `project_id` BIGINT NOT NULL,
    `type` ENUM('STORY', 'BUG', 'TASK', 'EPIC') NOT NULL,
    `priority` ENUM('HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST') NOT NULL,
    `status` ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') NOT NULL,
    `assignee_id` BIGINT NULL,
    `reporter_id` BIGINT NOT NULL,
    `sprint_id` BIGINT NULL,
    `story_points` INT NULL,
    `due_date` DATETIME NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `UK_issues_issue_key` (`issue_key`),
    INDEX `FK_issues_project_id` (`project_id`),
    INDEX `FK_issues_assignee_id` (`assignee_id`),
    INDEX `FK_issues_reporter_id` (`reporter_id`),
    INDEX `FK_issues_sprint_id` (`sprint_id`),
    INDEX `IDX_issues_status` (`status`),
    INDEX `IDX_issues_type` (`type`),
    INDEX `IDX_issues_priority` (`priority`),
    CONSTRAINT `FK_issues_project_id`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`)
                                                              ON DELETE CASCADE
                                                              ON UPDATE CASCADE,
    CONSTRAINT `FK_issues_assignee_id`
    FOREIGN KEY (`assignee_id`)
    REFERENCES `users` (`id`)
                                                              ON DELETE SET NULL
                                                              ON UPDATE CASCADE,
    CONSTRAINT `FK_issues_reporter_id`
    FOREIGN KEY (`reporter_id`)
    REFERENCES `users` (`id`)
                                                              ON DELETE RESTRICT
                                                              ON UPDATE CASCADE,
    CONSTRAINT `FK_issues_sprint_id`
    FOREIGN KEY (`sprint_id`)
    REFERENCES `sprints` (`id`)
                                                              ON DELETE SET NULL
                                                              ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comments` (
                                          `id` BIGINT NOT NULL AUTO_INCREMENT,
                                          `content` TEXT NOT NULL,
                                          `issue_id` BIGINT NOT NULL,
                                          `user_id` BIGINT NOT NULL,
                                          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          PRIMARY KEY (`id`),
    INDEX `FK_comments_issue_id` (`issue_id`),
    INDEX `FK_comments_user_id` (`user_id`),
    CONSTRAINT `FK_comments_issue_id`
    FOREIGN KEY (`issue_id`)
    REFERENCES `issues` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `FK_comments_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `attachments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `attachments` (
                                             `id` BIGINT NOT NULL AUTO_INCREMENT,
                                             `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(100) NULL,
    `issue_id` BIGINT NOT NULL,
    `uploaded_by` BIGINT NOT NULL,
    `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `FK_attachments_issue_id` (`issue_id`),
    INDEX `FK_attachments_uploaded_by` (`uploaded_by`),
    CONSTRAINT `FK_attachments_issue_id`
    FOREIGN KEY (`issue_id`)
    REFERENCES `issues` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `FK_attachments_uploaded_by`
    FOREIGN KEY (`uploaded_by`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    ) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Initial Data - Roles
-- -----------------------------------------------------
INSERT INTO `roles` (`name`) VALUES
                                 ('ROLE_ADMIN'),
                                 ('ROLE_MANAGER'),
                                 ('ROLE_USER'),
                                 ('ROLE_GUEST');

-- -----------------------------------------------------
-- Create system admin user
-- Password is 'admin' (BCrypt encoded)
-- Encoded using: BCryptPasswordEncoder().encode("admin")
-- -----------------------------------------------------
INSERT INTO `users` (
    `username`,
    `password`,
    `email`,
    `full_name`,
    `is_enabled`,
    `avatar_url`
) VALUES (
             'admin',
             '$2a$10$7z3gUsVDPxxFhWjsjUBCx.usfXqLmPAn5yR/GoeqKq0qjnUz0GTYG',
             'admin@example.com',
             'System Administrator',
             TRUE,
             NULL
         );

-- -----------------------------------------------------
-- Assign ADMIN role to admin user
-- -----------------------------------------------------
INSERT INTO `user_roles` (`user_id`, `role_id`)
VALUES (1, (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'));

-- -----------------------------------------------------
-- Create a test project manager
-- Password is 'manager' (BCrypt encoded)
-- -----------------------------------------------------
INSERT INTO `users` (
    `username`,
    `password`,
    `email`,
    `full_name`,
    `is_enabled`,
    `avatar_url`
) VALUES (
             'manager',
             '$2a$10$HyQHmGH5ILBcJOG4gmT3EONiB/f4.mSJUOTNVSW2U3/.cFPIQbbuW',
             'manager@example.com',
             'Project Manager',
             TRUE,
             NULL
         );

-- Assign PROJECT_MANAGER role to manager user
INSERT INTO `user_roles` (`user_id`, `role_id`)
VALUES (2, (SELECT id FROM roles WHERE name = 'ROLE_MANAGER'));

-- -----------------------------------------------------
-- Create a test developer
-- Password is 'dev' (BCrypt encoded)
-- -----------------------------------------------------
INSERT INTO `users` (
    `username`,
    `password`,
    `email`,
    `full_name`,
    `is_enabled`,
    `avatar_url`
) VALUES (
             'dev',
             '$2a$10$qBjOZcmowJSc9kCrBjMfyOXG6dF6fTrN4B0nfyKRiUNLcMa59iZn2',
             'dev@example.com',
             'Developer',
             TRUE,
             NULL
         );

-- Assign DEVELOPER role to dev user
INSERT INTO `user_roles` (`user_id`, `role_id`)
VALUES (3, (SELECT id FROM roles WHERE name = 'ROLE_USER'));