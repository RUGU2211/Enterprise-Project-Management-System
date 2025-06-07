package io.agileintelligence.ppmtool.repositories.team;

import io.agileintelligence.ppmtool.domain.Project;
import io.agileintelligence.ppmtool.domain.team.ProjectTeam;
import io.agileintelligence.ppmtool.domain.team.Team;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectTeamRepository extends CrudRepository<ProjectTeam, Long> {
    
    List<ProjectTeam> findByTeam(Team team);
    
    List<ProjectTeam> findByProject(Project project);
    
    Optional<ProjectTeam> findByTeamAndProject(Team team, Project project);
    
    void deleteByTeamAndProject(Team team, Project project);
} 