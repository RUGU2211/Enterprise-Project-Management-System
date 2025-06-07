package com.example.project_management_tool.repositories;

import com.example.project_management_tool.domain.Team;
import com.example.project_management_tool.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {
    
    Team findById(long id);
    
    List<Team> findByUser(User user);
    
    List<Team> findByTeamLead(String teamLead);
    
    @Override
    Iterable<Team> findAll();
} 