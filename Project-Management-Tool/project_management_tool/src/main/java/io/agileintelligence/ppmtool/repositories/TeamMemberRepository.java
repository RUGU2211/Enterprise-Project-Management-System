package io.agileintelligence.ppmtool.repositories;

import io.agileintelligence.ppmtool.domain.team.Team;
import io.agileintelligence.ppmtool.domain.team.TeamMember;
import io.agileintelligence.ppmtool.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeamId(Long teamId);
    List<TeamMember> findByUserId(Long userId);
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
    Optional<TeamMember> findByTeamAndUser(Team team, User user);
    List<TeamMember> findByTeam(Team team);
    List<TeamMember> findByUser(User user);
    int countByTeam(Team team);
} 