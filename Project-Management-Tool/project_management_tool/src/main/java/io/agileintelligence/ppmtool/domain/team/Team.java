package io.agileintelligence.ppmtool.domain.team;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.agileintelligence.ppmtool.domain.user.User;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_lead_id")
    @JsonIgnore
    private User teamLead;

    @Transient
    private String leadName;

    @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, mappedBy = "team", orphanRemoval = true)
    @JsonIgnore
    private Set<TeamMember> members = new HashSet<>();

    @OneToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, mappedBy = "team", orphanRemoval = true)
    @JsonIgnore
    private Set<ProjectTeam> projects = new HashSet<>();

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updatedAt;
    
    public Team() {
    }
    
    public Team(Long id, String name, String description, User teamLead, String leadName, 
                Set<TeamMember> members, Set<ProjectTeam> projects, Date createdAt, Date updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teamLead = teamLead;
        this.leadName = leadName;
        this.members = members;
        this.projects = projects;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
    
    @Transient
    public int getMemberCount() {
        return members != null ? members.size() : 0;
    }
    
    @Transient
    public int getProjectCount() {
        return projects != null ? projects.size() : 0;
    }
    
    public User getTeamLead() {
        return teamLead;
    }
    
    public void setTeamLead(User teamLead) {
        this.teamLead = teamLead;
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
    
    public String getLeadName() {
        return leadName;
    }
    
    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }
    
    public Set<TeamMember> getMembers() {
        return members;
    }
    
    public void setMembers(Set<TeamMember> members) {
        this.members = members;
    }
    
    public Set<ProjectTeam> getProjects() {
        return projects;
    }
    
    public void setProjects(Set<ProjectTeam> projects) {
        this.projects = projects;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
} 