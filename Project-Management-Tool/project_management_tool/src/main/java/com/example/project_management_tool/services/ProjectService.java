package com.example.project_management_tool.services;

import com.example.project_management_tool.domain.Backlog;
import com.example.project_management_tool.domain.Project;
import com.example.project_management_tool.domain.User;
import com.example.project_management_tool.exceptions.ProjectIdException;
import com.example.project_management_tool.exceptions.ProjectNotFoundException;
import com.example.project_management_tool.exceptions.UserNotFoundException;
import com.example.project_management_tool.repositories.BacklogRepository;
import com.example.project_management_tool.repositories.ProjectRepository;
import com.example.project_management_tool.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


//ProjectService class to perform CRUD operations through Repository
@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BacklogRepository backlogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    //saveOrUpdate project
    public Project saveOrUpdateProject(Project project, String username){

        if(project.getId() != null){
            Project existingProject = projectRepository.findByProjectIdentifier(project.getProjectIdentifier());
            if(existingProject !=null &&(!existingProject.getProjectLeader().equals(username))){
                throw new ProjectNotFoundException("Project not found in your account");
            }else if(existingProject == null){
                throw new ProjectNotFoundException("Project with ID: '"+project.getProjectIdentifier()+"' cannot be updated because it doesn't exist");
            }
        }

        //checking if project already exists
        try{
            User user = userRepository.findByUsername(username);
            project.setUser(user);
            project.setProjectLeader(user.getUsername());
            project.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());

            // Always create a backlog for new projects
            if(project.getId()==null){
                Backlog backlog = new Backlog();
                project.setBacklog(backlog);
                backlog.setProject(project);
                backlog.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
            }

            // For updates, make sure to fetch the existing backlog
            if(project.getId()!=null){
                Backlog existingBacklog = backlogRepository.findByProjectIdentifier(project.getProjectIdentifier().toUpperCase());
                // Create a new backlog if one doesn't exist for this project
                if (existingBacklog == null) {
                    Backlog backlog = new Backlog();
                    project.setBacklog(backlog);
                    backlog.setProject(project);
                    backlog.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());
                } else {
                    project.setBacklog(existingBacklog);
                }
            }

            return projectRepository.save(project);
        }catch (Exception e){
            throw new ProjectIdException("ProjectID " + project.getProjectIdentifier().toUpperCase() + " already exists");
        }
    }

    //finding project by projectId
    public Project findProjectByIdentifier(String projectId, String username){

        Project project = projectRepository.findByProjectIdentifier(projectId.toUpperCase());

        //if no project with projectID was found
        if(project==null){
            throw new ProjectIdException("ProjectID " + projectId + " doesn't exists");
        }

        if(!project.getProjectLeader().equals(username)){
            throw new ProjectNotFoundException("Project not found in your account");
        }


        return project;
    }

    //finding all projects
    public Iterable<Project> findAllProjects(String username){
        return projectRepository.findAllByProjectLeader(username);
    }

    //deleting project by projectId
    public void deleteProjectByIdentifier(String projectId, String username){

        //checking is project exists in the database
        projectRepository.delete(findProjectByIdentifier(projectId, username));
    }

    public Project addUserToProject(String projectId, Long userId, String role, String username) {
        Project project = findProjectByIdentifier(projectId, username);
        User user = userService.findUserById(userId);
        
        if (project == null) {
            throw new ProjectNotFoundException("Project with ID '" + projectId + "' not found");
        }
        
        if (user == null) {
            throw new UserNotFoundException("User with ID '" + userId + "' not found");
        }
        
        // Check if user is already in the project
        if (project.getUsers().stream().anyMatch(u -> u.getId().equals(userId))) {
            throw new RuntimeException("User is already a member of this project");
        }
        
        // Add user to project
        project.getUsers().add(user);
        
        // Save and return updated project
        return projectRepository.save(project);
    }
}
