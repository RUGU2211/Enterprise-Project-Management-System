package com.example.project_management_tool.repositories;

import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.TeamMember;
import com.example.project_management_tool.domain.User;
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
    
    int countByTeam(Team team);
} 