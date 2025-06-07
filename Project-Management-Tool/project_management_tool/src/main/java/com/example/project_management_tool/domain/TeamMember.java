package com.example.project_management_tool.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
public class


TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnore
    private Team team;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Enumerated(EnumType.STRING)
    private TeamRole role = TeamRole.MEMBER; // Default role
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date joinedAt;
    
    @Transient
    private String username;
    
    @Transient 
    private String fullName;
    
    public TeamMember() {
    }
    
    public TeamMember(Team team, User user, TeamRole role) {
        this.team = team;
        this.user = user;
        this.role = role;
    }
    
    @PrePersist
    protected void onCreate() {
        this.joinedAt = new Date();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Team getTeam() {
        return team;
    }
    
    public void setTeam(Team team) {
        this.team = team;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public TeamRole getRole() {
        return role;
    }
    
    public void setRole(TeamRole role) {
        this.role = role;
    }
    
    public Date getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public String getUsername() {
        return user != null ? user.getUsername() : null;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
} 