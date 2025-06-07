package io.agileintelligence.ppmtool.repositories.team;

import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {
    
    Optional<Team> findById(Long id);
    
    List<Team> findAll();
    
    List<Team> findByTeamLead(User teamLead);
} 