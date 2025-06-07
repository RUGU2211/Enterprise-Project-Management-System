package io.agileintelligence.ppmtool.domain.team;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.agileintelligence.ppmtool.domain.Project;

import javax.persistence.*;
import java.util.Date;

@Entity
public class ProjectTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnore
    private Team team;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date assignedAt;
    
    public ProjectTeam() {
    }
    
    public ProjectTeam(Team team, Project project) {
        this.team = team;
        this.project = project;
        this.assignedAt = new Date();
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
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public Date getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(Date assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    @PrePersist
    protected void onCreate() {
        this.assignedAt = new Date();
    }
} 