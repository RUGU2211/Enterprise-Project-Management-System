package com.example.project_management_tool.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Team name is required")
    @Size(min = 2, max = 100, message = "Team name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Team description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    private String teamIcon = "users"; // Default icon
    
    private String teamColor = "#3f51b5"; // Default color (Indigo)

    @NotBlank(message = "Team identifier is required")
    @Size(min = 4, max = 5, message = "Please use 4 to 5 characters")
    @Column(updatable = false, unique = true)
    private String teamIdentifier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", updatable = false, nullable = false)
    @JsonIgnore
    private User user;

    @JsonProperty
    private String teamLead;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date created_At;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updated_At;
    
    @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, mappedBy = "team", orphanRemoval = true)
    @JsonIgnore
    private Set<TeamMember> members = new HashSet<>();
    
    @Transient
    private int memberCount = 0;
    
    @Transient
    private int projectCount = 0;
    
    public Team() {
    }

    @PrePersist
    protected void onCreate() {
        this.created_At = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated_At = new Date();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTeamIcon() {
        return teamIcon;
    }

    public void setTeamIcon(String teamIcon) {
        this.teamIcon = teamIcon;
    }

    public String getTeamColor() {
        return teamColor;
    }

    public void setTeamColor(String teamColor) {
        this.teamColor = teamColor;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getTeamLead() {
        return teamLead;
    }

    public void setTeamLead(String teamLead) {
        this.teamLead = teamLead;
    }
    
    public Date getCreatedAt() {
        return created_At;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.created_At = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updated_At;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updated_At = updatedAt;
    }
    
    public int getMemberCount() {
        return memberCount;
    }
    
    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }
    
    public int getProjectCount() {
        return projectCount;
    }
    
    public void setProjectCount(int projectCount) {
        this.projectCount = projectCount;
    }
    
    public Set<TeamMember> getMembers() {
        return members;
    }
    
    public void setMembers(Set<TeamMember> members) {
        this.members = members;
    }

    public String getTeamIdentifier() {
        return teamIdentifier;
    }

    public void setTeamIdentifier(String teamIdentifier) {
        this.teamIdentifier = teamIdentifier;
    }
} 