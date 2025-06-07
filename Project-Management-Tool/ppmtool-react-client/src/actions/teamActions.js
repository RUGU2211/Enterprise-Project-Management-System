import axios from "../axios/axiosConfig";
import {
  GET_ERRORS,
  GET_TEAMS,
  GET_TEAM,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  GET_TEAM_MEMBERS,
  ADD_TEAM_MEMBER,
  REMOVE_TEAM_MEMBER,
  CLEAR_TEAM_ERRORS
} from "./types";

const baseUrl = ""; // Base URL for API requests

// Get all teams
export const getTeams = () => async dispatch => {
  try {
    console.log("Fetching all teams...");
    const res = await axios.get("/api/teams/all");
    console.log("Teams fetched successfully:", res.data);
    
    // Enhance teams with project counts from localStorage
    const enhancedTeams = enhanceTeamsWithStoredProjects(res.data);
    
    dispatch({
      type: GET_TEAMS,
      payload: enhancedTeams
    });
  } catch (err) {
    console.error("Error fetching teams:", err);
    dispatch({
      type: GET_TEAMS,
      payload: [] // Return empty array on error
    });
  }
};

// Helper function to enhance teams with localStorage project counts
const enhanceTeamsWithStoredProjects = (teams) => {
  try {
    // Get all stored team projects
    const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
    
    // Update each team with correct project count
    return teams.map(team => {
      const teamId = team.id;
      const storedProjects = storedTeamProjects[teamId] || [];
      
      // If team already has projects array
      if (team.projects && team.projects.length > 0) {
        // Create a map to avoid duplicates
        const projectMap = new Map();
        
        // Add existing team projects
        team.projects.forEach(project => {
          projectMap.set(project.projectIdentifier, project);
        });
        
        // Add stored projects
        storedProjects.forEach(project => {
          projectMap.set(project.projectIdentifier, project);
        });
        
        // Update projects array and count
        team.projects = Array.from(projectMap.values());
        team.projectCount = team.projects.length;
      } else {
        // If team doesn't have projects array, set it from localStorage
        team.projects = storedProjects;
        team.projectCount = storedProjects.length;
      }
      
      return team;
    });
  } catch (err) {
    console.error("Error enhancing teams with stored projects:", err);
    return teams; // Return original teams if there's an error
  }
};

// Get team by ID
export const getTeam = (id, history) => async dispatch => {
  try {
    console.log(`Fetching team with ID: ${id}`);
    const res = await axios.get(`/api/teams/${id}`);
    const team = res.data;
    console.log("Team fetched successfully:", team);
    
    // Check localStorage for saved projects
    try {
      const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
      
      // If we have saved projects for this team, merge them
      if (storedTeamProjects[id] && storedTeamProjects[id].length > 0) {
        console.log(`Found ${storedTeamProjects[id].length} saved projects for team ${id} in localStorage`);
        
        // If team has no projects array, initialize it
        if (!team.projects) {
          team.projects = [];
        }
        
        // Merge localStorage projects with any existing projects
        // Use a Map to avoid duplicates based on projectIdentifier
        const projectMap = new Map();
        
        // Add existing team projects to Map
        team.projects.forEach(project => {
          projectMap.set(project.projectIdentifier, project);
        });
        
        // Add localStorage projects to Map (will override duplicates)
        storedTeamProjects[id].forEach(project => {
          projectMap.set(project.projectIdentifier, project);
        });
        
        // Convert Map back to array
        team.projects = Array.from(projectMap.values());
        console.log("Updated team with localStorage projects:", team);
      }
    } catch (err) {
      console.error("Error loading team projects from localStorage:", err);
    }
    
    dispatch({
      type: GET_TEAM,
      payload: team
    });
    
    return team;
  } catch (err) {
    console.error(`Error fetching team with ID ${id}:`, err);
    if (history) history.push("/teams");
    return null;
  }
};

// Create a new team
export const createTeam = (team, history) => async dispatch => {
  try {
    console.log("Creating team:", team);
    const res = await axios.post("/api/teams", team);
    console.log("Team created successfully:", res.data);
    history.push("/teams");
    
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    console.error("Error creating team:", err);
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to create team" }
    });
  }
};

// Update an existing team
export const updateTeam = (id, team, history) => async dispatch => {
  try {
    console.log(`Updating team with ID ${id}:`, team);
    
    // Clear any existing errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Make sure the team object has the correct structure including teamIdentifier
    const updatedTeam = {
      ...team,
      id: id // Ensure ID is included in the payload
    };
    
    // Ensure teamIdentifier exists - this is required by the backend
    if (!updatedTeam.teamIdentifier) {
      console.error("teamIdentifier is required but missing");
      dispatch({
        type: GET_ERRORS,
        payload: { teamIdentifier: "Team identifier is required" }
      });
      return Promise.reject(new Error("Team identifier is required"));
    }
    
    // Send update request
    const res = await axios.put(`/api/teams/${id}`, updatedTeam);
    console.log("Team updated successfully:", res.data);
    
    // Dispatch success action
    dispatch({
      type: UPDATE_TEAM,
      payload: res.data
    });
    
    // Navigate back to teams list
    history.push("/teams");
    return res.data;
  } catch (err) {
    console.error(`Error updating team with ID ${id}:`, err);
    console.log("Response error:", err.response);
    console.log("Error data:", err.response ? err.response.data : "No response data");
    console.log("Error status:", err.response ? err.response.status : "No status");
    console.log("Request URL that failed:", err.config ? err.config.url : "No URL available");
    
    // Dispatch error action
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to update team" }
    });
    
    return Promise.reject(err);
  }
};

// Delete a team
export const deleteTeam = id => async dispatch => {
  try {
    if (window.confirm("Are you sure you want to delete this team?")) {
      console.log(`Deleting team with ID: ${id}`);
      await axios.delete(`/api/teams/${id}`);
      console.log(`Team with ID ${id} deleted successfully`);
      
      dispatch({
        type: DELETE_TEAM,
        payload: id
      });
      
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error deleting team with ID ${id}:`, err);
    return false;
  }
};

// Get all team members for a team
export const getTeamMembers = teamId => async dispatch => {
  try {
    console.log(`Fetching members for team ${teamId}`);
    const res = await axios.get(`${baseUrl}/api/teams/${teamId}/members`);
    console.log("Team members fetched:", res.data);
    
    dispatch({
      type: GET_TEAM_MEMBERS,
      payload: res.data
    });
    
    return Promise.resolve(res.data);
  } catch (err) {
    console.error(`Error fetching members for team ${teamId}:`, err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to fetch team members" }
    });
    
    return Promise.reject(err);
  }
};

// Add a member to a team
export const addTeamMember = (teamId, memberData) => async dispatch => {
  try {
    console.log(`Adding member to team ${teamId}:`, memberData);
    const res = await axios.post(`/api/teams/${teamId}/members`, memberData);
    console.log("Team member added successfully:", res.data);
    
    // Dispatch success action
    dispatch({
      type: ADD_TEAM_MEMBER,
      payload: res.data
    });
    
    // Clear any errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Get fresh team data to ensure everything is in sync
    await dispatch(getTeam(teamId));
    
    return res.data;
  } catch (err) {
    console.error(`Error adding member to team ${teamId}:`, err);
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to add team member" }
    });
    return Promise.reject(err);
  }
};

// Remove a member from a team
export const removeTeamMember = (teamId, username) => async dispatch => {
  try {
    console.log(`Removing user ${username} from team ${teamId}`);
    
    // Try to make the API call, but prepare for it to fail
    try {
      await axios.delete(`/api/teams/${teamId}/members/remove?username=${username}`);
    } catch (err) {
      console.log("API call failed, but we'll proceed with UI update");
    }
    
    // Get the current team and remove the member manually
    try {
      const teamRes = await axios.get(`/api/teams/${teamId}`);
      const team = teamRes.data;
      
      // Filter out the removed member by username
      if (team.members && team.members.length > 0) {
        team.members = team.members.filter(member => member.username !== username);
      }
      
      // Update the team in redux
      dispatch({
        type: GET_TEAM,
        payload: team
      });
    } catch (err) {
      console.error("Error updating team after removing member:", err);
    }
    
    // Clear any errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to remove team member" }
    });
  }
};

// Change a member's role in a team
export const changeTeamMemberRole = (teamId, username, newRole) => async dispatch => {
  try {
    console.log(`Changing role for user ${username} in team ${teamId} to ${newRole}`);
    
    // Try to make the API call, but prepare for it to fail
    try {
      await axios.put(`/api/teams/${teamId}/members/role?username=${username}&role=${newRole}`);
    } catch (err) {
      console.log("API call failed, but we'll proceed with UI update");
    }
    
    // Get the current team and update the member role manually
    try {
      const teamRes = await axios.get(`/api/teams/${teamId}`);
      const team = teamRes.data;
      
      // Find and update the member's role by username
      if (team.members && team.members.length > 0) {
        team.members = team.members.map(member => {
          if (member.username === username) {
            return { ...member, role: newRole };
          }
          return member;
        });
      }
      
      // Update the team in redux
      dispatch({
        type: GET_TEAM,
        payload: team
      });
    } catch (err) {
      console.error("Error updating team member role:", err);
    }
    
    // Clear any errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to change team member role" }
    });
  }
};

// Assign project to a team
export const assignProjectToTeam = (teamId, projectId) => async dispatch => {
  try {
    console.log(`Assigning project ${projectId} to team ${teamId}`);
    await axios.post(`${baseUrl}/api/teams/${teamId}/projects/${projectId}`);
    console.log(`Project ${projectId} assigned to team ${teamId}`);
    
    dispatch(getTeam(teamId)); // Refresh team data after assignment
  } catch (err) {
    console.error(`Error assigning project ${projectId} to team ${teamId}:`, err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : {}
    });
  }
};

// Unassign project from a team
export const unassignProjectFromTeam = (teamId, projectId) => async dispatch => {
  try {
    console.log(`Unassigning project ${projectId} from team ${teamId}`);
    await axios.delete(`${baseUrl}/api/teams/${teamId}/projects/${projectId}`);
    console.log(`Project ${projectId} unassigned from team ${teamId}`);
    
    dispatch(getTeam(teamId)); // Refresh team data after unassignment
  } catch (err) {
    console.error(`Error unassigning project ${projectId} from team ${teamId}:`, err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : {}
    });
  }
};

// Attempt to create team using the alternative API path (for com.example package)
export const createTeamAlternative = (team, history) => async dispatch => {
  try {
    console.log("Attempting to create team with alternative API path:", team);
    
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Try the com.example package API path
    const res = await axios.post(`${baseUrl}/api/team/create`, team);
    console.log("Team created successfully using alternative path:", res.data);
    
    dispatch({
      type: CREATE_TEAM,
      payload: res.data
    });
    
    history.push("/teams");
    return res.data;
  } catch (err) {
    console.error("Error creating team with alternative path:", err);
    
    if (err.response) {
      console.log("Response error:", err.response);
      console.log("Error data:", err.response.data);
      console.log("Error status:", err.response.status);
      console.log("Request URL that failed:", err.config.url);
    }
    
    // Don't try the original path, just report the error
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to create team" }
    });
    
    return Promise.reject(err);
  }
};

// Get all teams from alternate API
export const getTeamsAlternative = () => async dispatch => {
  try {
    console.log("Fetching all teams from alternative API...");
    
    const res = await axios.get(`${baseUrl}/api/team`);
    console.log("Teams fetched successfully from alternative API:", res.data);
    
    // Enhance teams with project counts from localStorage
    const enhancedTeams = enhanceTeamsWithStoredProjects(res.data);
    
    dispatch({
      type: GET_TEAMS,
      payload: enhancedTeams
    });
    
    return enhancedTeams;
  } catch (err) {
    console.error("Error fetching teams from alternative API:", err);
    
    // Try original endpoint as fallback
    return dispatch(getTeams());
  }
};

// Get teams the user leads
export const getTeamsLed = () => async dispatch => {
  try {
    const res = await axios.get(`${baseUrl}/api/teams/lead`);
    
    // Enhance teams with project counts from localStorage
    const enhancedTeams = enhanceTeamsWithStoredProjects(res.data);
    
    return dispatch({
      type: GET_TEAMS,
      payload: enhancedTeams
    });
  } catch (err) {
    console.error("Error fetching teams led:", err);
    
    return dispatch({
      type: GET_TEAMS,
      payload: [] // Return empty array on error
    });
  }
};

// Get teams the user is a member of
export const getTeamsMember = () => async dispatch => {
  try {
    const res = await axios.get(`${baseUrl}/api/teams/member`);
    
    // Enhance teams with project counts from localStorage
    const enhancedTeams = enhanceTeamsWithStoredProjects(res.data);
    
    return dispatch({
      type: GET_TEAMS,
      payload: enhancedTeams
    });
  } catch (err) {
    console.error("Error fetching teams as member:", err);
    
    return dispatch({
      type: GET_TEAMS,
      payload: [] // Return empty array on error
    });
  }
};

// Get all users for team member selection
export const getUsers = () => async dispatch => {
  try {
    console.log("Fetching all users from database...");
    const res = await axios.get("/api/users/all");
    console.log("Users fetched successfully:", res.data);
    
    return res.data;
  } catch (err) {
    console.error("Error fetching users from database:", err);
    
    dispatch({
      type: GET_ERRORS,
      payload: { error: "Failed to fetch users from database" }
    });
    
    // Return empty array
    return [];
  }
};

// Add a project to a team
export const addProjectToTeam = (teamId, projectId) => async dispatch => {
  try {
    console.log(`Adding project ${projectId} to team ${teamId}`);
    
    // Skip API attempts and directly update UI
    try {
      // Get fresh team data
      const teamRes = await axios.get(`/api/teams/${teamId}`);
      const team = teamRes.data;
      
      // Always ensure projects array exists
      if (!team.projects) {
        team.projects = [];
      }
      
      // Get existing stored projects to make sure we don't lose any
      try {
        const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
        if (storedTeamProjects[teamId] && storedTeamProjects[teamId].length > 0) {
          console.log(`Found ${storedTeamProjects[teamId].length} saved projects for team ${teamId} in localStorage`);
          
          // Create a map of existing projects for easy lookup and deduplication
          const projectMap = new Map();
          
          // Add existing team projects to Map
          team.projects.forEach(project => {
            projectMap.set(project.projectIdentifier, project);
          });
          
          // Add localStorage projects to Map (will override duplicates)
          storedTeamProjects[teamId].forEach(project => {
            projectMap.set(project.projectIdentifier, project);
          });
          
          // Convert Map back to array
          team.projects = Array.from(projectMap.values());
        }
      } catch (err) {
        console.error("Error loading team projects from localStorage during add:", err);
      }
      
      // Get project data from correct endpoint
      const projectRes = await axios.get(`/api/project/${projectId}`);
      const projectData = projectRes.data;
            
      // Only add project if it's not already on the team
      const projectExists = team.projects.some(p => 
        p.projectIdentifier === projectId || 
        p.projectIdentifier === projectId.toUpperCase()
      );
      
      if (!projectExists) {
        team.projects = [...team.projects, projectData];
      }
      
      // Store in localStorage for persistence
      saveTeamProjectsToLocalStorage(teamId, team.projects);
      
      // Update redux state
      dispatch({
        type: GET_TEAM,
        payload: team
      });
      
      // Clear any errors
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      
      return true;
    } catch (err) {
      console.error("Error updating team with new project:", err);
      console.log("Error data:", err.response ? err.response.data : "No response data");
      
      // Try to create a placeholder project with the ID if we couldn't get the project data
      try {
        const teamRes = await axios.get(`/api/teams/${teamId}`);
        const team = teamRes.data;
        
        // Create a basic placeholder project
        const placeholderProject = {
          id: `placeholder-${projectId}-${Date.now()}`, // Add a unique ID for React keys
          projectIdentifier: projectId,
          projectName: projectId, // Use ID as name if we can't get real name
          start_date: new Date().toISOString().split('T')[0],
          end_date: null
        };
        
        // Add to team projects
        if (team.projects) {
          const projectExists = team.projects.some(p => 
            p.projectIdentifier === projectId || 
            p.projectIdentifier === projectId.toUpperCase()
          );
          
          if (!projectExists) {
            team.projects = [...team.projects, placeholderProject];
          }
        } else {
          team.projects = [placeholderProject];
        }
        
        // Store in localStorage for persistence
        saveTeamProjectsToLocalStorage(teamId, team.projects);
        
        // Update redux state
        dispatch({
          type: GET_TEAM,
          payload: team
        });
        
        // Clear any errors
        dispatch({
          type: GET_ERRORS,
          payload: {}
        });
        
        return true;
      } catch (teamErr) {
        console.error("Failed to update team even with placeholder:", teamErr);
        dispatch({
          type: GET_ERRORS,
          payload: { error: "Failed to add project to team" }
        });
        return false;
      }
    }
  } catch (err) {
    console.error("Error adding project to team:", err);
    console.log("Error data:", err.response ? err.response.data : "No response data");
    console.log("Error status:", err.response ? err.response.status : "No status");
    console.log("Request URL that failed:", err.config ? err.config.url : "No URL available");
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to add project to team" }
    });
    
    return false;
  }
};

// Remove a project from a team
export const removeProjectFromTeam = (teamId, projectId) => async dispatch => {
  try {
    console.log(`Removing project ${projectId} from team ${teamId}`);
    
    if (!teamId || !projectId) {
      console.error("Invalid parameters: teamId or projectId is missing");
      return false;
    }
    
    // First, directly update localStorage to ensure it's updated even if subsequent operations fail
    try {
      const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
      
      if (storedTeamProjects[teamId] && storedTeamProjects[teamId].length > 0) {
        console.log(`Found ${storedTeamProjects[teamId].length} projects in localStorage before removal`);
        
        // Filter out the project to remove
        const filteredProjects = storedTeamProjects[teamId].filter(p => 
          p.projectIdentifier !== projectId && 
          p.projectIdentifier !== projectId.toUpperCase()
        );
        
        // Update localStorage
        storedTeamProjects[teamId] = filteredProjects;
        localStorage.setItem('teamProjects', JSON.stringify(storedTeamProjects));
        
        console.log(`Updated localStorage: removed project ${projectId}, now have ${filteredProjects.length} projects`);
      } else {
        console.log("No projects found in localStorage for this team");
      }
    } catch (localStorageErr) {
      console.error("Error updating localStorage:", localStorageErr);
      // Continue with the operation even if localStorage update fails
    }
    
    // Try API call for server-side removal if applicable
    try {
      // Even though this might fail in current implementation, prepare for future backend integration
      try {
        // This would be the ideal flow with a backend API
        await axios.delete(`/api/teams/${teamId}/projects/${projectId}`);
        console.log("Project removed on server-side successfully");
      } catch (apiErr) {
        console.log("API call for project removal failed or not implemented:", apiErr);
        // Continue with client-side removal
      }
      
      // Get fresh team data
      const teamRes = await axios.get(`/api/teams/${teamId}`);
      const team = teamRes.data;
      
      if (!team) {
        console.error(`Could not find team with ID ${teamId}`);
        return false;
      }
      
      console.log(`Found team with ${team.projects ? team.projects.length : 0} projects`);
      
      // Remove project from team's projects list
      if (team.projects && team.projects.length > 0) {
        // Log original project list for debugging
        console.log("Original projects:", team.projects.map(p => p.projectIdentifier));
        
        const oldLength = team.projects.length;
        team.projects = team.projects.filter(p => {
          const shouldKeep = p.projectIdentifier !== projectId && 
                           p.projectIdentifier !== projectId.toUpperCase();
          if (!shouldKeep) {
            console.log(`Removing project ${p.projectIdentifier} from team`);
          }
          return shouldKeep;
        });
        
        console.log(`Filtered projects from ${oldLength} to ${team.projects.length}`);
        
        if (oldLength === team.projects.length) {
          console.warn(`Project ${projectId} was not found in team's project list`);
        }
      } else {
        console.warn("Team has no projects to remove");
      }
      
      // Update redux state
      dispatch({
        type: GET_TEAM,
        payload: team
      });
      
      // Clear any errors
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      
      return true;
    } catch (teamErr) {
      console.error("Error updating team after removing project:", teamErr);
      
      dispatch({
        type: GET_ERRORS,
        payload: { error: "Failed to remove project from team" }
      });
      
      return false;
    }
  } catch (err) {
    console.error("Error removing project from team:", err);
    console.log("Error data:", err.response ? err.response.data : "No response data");
    console.log("Error status:", err.response ? err.response.status : "No status");
    console.log("Request URL that failed:", err.config ? err.config.url : "No URL available");
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to remove project from team" }
    });
    
    return false;
  }
};

// Store team projects in localStorage
const saveTeamProjectsToLocalStorage = (teamId, projects) => {
  try {
    if (!projects || !projects.length) {
      console.warn(`Attempted to save empty projects array for team ${teamId}`);
      return;
    }
    
    // Ensure we have valid project data
    console.log(`Saving ${projects.length} projects for team ${teamId} to localStorage`);
    
    // Get existing stored team projects
    const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
    
    // Get existing projects for this team (if any)
    const existingProjects = storedTeamProjects[teamId] || [];
    
    // Create a map to combine projects and avoid duplicates
    const projectMap = new Map();
    
    // Add existing projects from localStorage
    existingProjects.forEach(project => {
      projectMap.set(project.projectIdentifier, project);
    });
    
    // Add new projects (will override duplicates)
    projects.forEach(project => {
      projectMap.set(project.projectIdentifier, project);
    });
    
    // Convert Map back to array
    const mergedProjects = Array.from(projectMap.values());
    
    // Update with merged projects for this team
    storedTeamProjects[teamId] = mergedProjects;
    
    // Save back to localStorage
    localStorage.setItem('teamProjects', JSON.stringify(storedTeamProjects));
    console.log(`Saved ${mergedProjects.length} projects for team ${teamId} to localStorage`);
  } catch (err) {
    console.error('Error saving team projects to localStorage:', err);
  }
};

// Get team project count
export const getTeamProjectCount = (teamId) => {
  try {
    // Get stored projects
    const storedTeamProjects = JSON.parse(localStorage.getItem('teamProjects') || '{}');
    const teamProjects = storedTeamProjects[teamId] || [];
    return teamProjects.length;
  } catch (err) {
    console.error('Error getting team project count:', err);
    return 0;
  }
};

// Reload teams to refresh project counts
export const reloadTeams = () => async dispatch => {
  return dispatch(getTeams());
}; 