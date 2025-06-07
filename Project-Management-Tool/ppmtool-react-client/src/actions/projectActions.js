import axios from "axios";
import { GET_ERRORS, GET_PROJECTS, GET_PROJECT, DELETE_PROJECT } from "./types";

export const createProject = (project, history) => async dispatch => {
  try {
    console.log("Creating project:", project);
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Fix date format if dates are provided
    if (project.start_date) {
      project.start_date = new Date(project.start_date).toISOString().split('T')[0];
    }
    
    if (project.end_date) {
      project.end_date = new Date(project.end_date).toISOString().split('T')[0];
    }
    
    const res = await axios.post(`/api/project`, project);
    console.log("Project created successfully:", res.data);
    
    history.push("/dashboard");
  } catch (err) {
    console.error("Error creating project:", err);
    
    if (err.response) {
      // Handle different response formats from server
      const errorPayload = typeof err.response.data === 'string' 
        ? { general: err.response.data } 
        : err.response.data;
      
      dispatch({
        type: GET_ERRORS,
        payload: errorPayload
      });
    } else {
      dispatch({
        type: GET_ERRORS,
        payload: { general: "Failed to create project. Please try again." }
      });
    }
  }
};

export const getProjects = () => async dispatch => {
  try {
    console.log("Fetching all projects...");
    const res = await axios.get(`/api/project/all`);
    console.log("Projects fetched successfully:", res.data);
    
    dispatch({
      type: GET_PROJECTS,
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    console.error("Error fetching projects:", err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to fetch projects" }
    });
    
    // Return empty array to prevent further errors in components
    dispatch({
      type: GET_PROJECTS,
      payload: []
    });
    
    return [];
  }
};

export const getProject = (id, history) => async dispatch => {
  try {
    console.log(`Fetching project with ID: ${id}`);
    const res = await axios.get(`/api/project/${id}`);
    console.log("Project fetched successfully:", res.data);
    
    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    console.error(`Error fetching project with ID ${id}:`, err);
    
    if (history) {
      history.push("/dashboard");
    }
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to fetch project details" }
    });
    
    return null;
  }
};

export const deleteProject = id => async dispatch => {
  try {
    if (window.confirm("Are you sure? This will delete the project and all the data related to it")) {
      console.log(`Deleting project with ID: ${id}`);
      
      // Clean up any # symbol that might be in the ID
      const cleanId = id.toString().replace('#', '').trim();
      console.log(`Sending DELETE request for project: ${cleanId}`);
      
      // First, immediately remove from Redux store for responsive UI
      dispatch({
        type: DELETE_PROJECT,
        payload: cleanId
      });
      
      // Remove project data from localStorage regardless of API result
      try {
        localStorage.removeItem(`project_${cleanId}`);
        if (localStorage.getItem("lastAccessedProjectBoard") === cleanId) {
          localStorage.removeItem("lastAccessedProjectBoard");
        }
        localStorage.removeItem(`projectTasks_${cleanId}`);
      } catch (e) {
        console.error("Error clearing localStorage data:", e);
      }
      
      try {
        // Try to delete from backend
        await axios.delete(`/api/project/${cleanId}`);
        console.log(`Project with ID ${cleanId} deleted successfully from backend`);
      } catch (err) {
        console.error(`Error during DELETE request for project ${cleanId}:`, err);
        
        // If the error is "doesn't exists" we don't need to do anything special
        // since we already removed it from the UI
        if (err.response && 
            err.response.status === 400 && 
            typeof err.response.data === 'string' && 
            err.response.data.includes("doesn't exists")) {
          
          console.log(`Project ${cleanId} doesn't exist in backend but was removed from UI`);
          
          // Show an informational message
          dispatch({
            type: GET_ERRORS,
            payload: { info: `Project was removed from your dashboard` }
          });
        } else {
          // For other errors, show the error but don't restore the project to UI
          dispatch({
            type: GET_ERRORS,
            payload: { 
              warning: "The project was removed from your dashboard, but there was an error on the server" 
            }
          });
        }
      }
      
      // After deletion, refresh the projects list to ensure UI is in sync
      setTimeout(() => {
        dispatch(getProjects());
      }, 300);
      
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Fatal error deleting project with ID ${id}:`, err);
    
    // Even for unexpected errors, still remove from UI for better UX
    dispatch({
      type: DELETE_PROJECT,
      payload: id.toString().replace('#', '').trim()
    });
    
    // For unexpected errors
    dispatch({
      type: GET_ERRORS,
      payload: { warning: "The project was removed from your dashboard, but an unexpected error occurred" }
    });
    
    return false;
  }
};
