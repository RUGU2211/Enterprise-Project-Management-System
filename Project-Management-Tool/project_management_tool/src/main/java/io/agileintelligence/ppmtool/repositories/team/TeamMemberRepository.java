package io.agileintelligence.ppmtool.repositories.team;

import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.team.TeamMember;
import io.agileintelligence.ppmtool.domain.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends CrudRepository<TeamMember, Long> {
    
    List<TeamMember> findByTeam(Team team);
    
    List<TeamMember> findByUser(User user);
    
    Optional<TeamMember> findByTeamAndUser(Team team, User user);
    
    void deleteByTeamAndUser(Team team, User user);
} 