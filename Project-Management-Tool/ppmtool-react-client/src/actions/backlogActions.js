import axios from "../axios/axiosConfig";
import {
  GET_ERRORS,
  GET_BACKLOG,
  GET_PROJECT_TASK,
  DELETE_PROJECT_TASK
} from "./types";

//Fix bug with priority in Spring Boot Server, needs to check null first
export const addProjectTask = (
  backlog_id,
  project_task,
  history
) => async dispatch => {
  try {
    await axios.post(`/api/backlog/${backlog_id}`, project_task);
    history.push(`/projectBoard/${backlog_id}`);
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Network Error" }
    });
  }
};

export const getBacklog = backlog_id => async dispatch => {
  try {
    console.log(`Fetching backlog for project: ${backlog_id}`);
    
    // Set loading state
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Store the current project board ID in localStorage
    localStorage.setItem("lastAccessedProjectBoard", backlog_id);
    
    const res = await axios.get(`/api/backlog/${backlog_id}`);
    
    // Check if we received empty data
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      console.log(`Backlog for ${backlog_id} is empty, initializing...`);
      // Still dispatch the empty backlog to avoid errors
      dispatch({
        type: GET_BACKLOG,
        payload: []
      });
    } else {
      console.log(`Backlog for ${backlog_id} loaded successfully with ${Array.isArray(res.data) ? res.data.length : 0} tasks`);
      dispatch({
        type: GET_BACKLOG,
        payload: res.data
      });
    }
  } catch (err) {
    console.error(`Error loading backlog for ${backlog_id}:`, err);
    
    // Determine the specific error type
    if (err.response) {
      if (err.response.status === 404) {
        dispatch({
          type: GET_ERRORS,
          payload: { projectNotFound: `Project with ID ${backlog_id} was not found` }
        });
      } else if (err.response.status === 403) {
        dispatch({
          type: GET_ERRORS,
          payload: { accessDenied: "You don't have permission to access this project board" }
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    } else {
      dispatch({
        type: GET_ERRORS,
        payload: { networkError: "Could not connect to the server. Please check your connection." }
      });
    }
    
    // Check if we should attempt to load from localStorage backup
    const cachedTasks = localStorage.getItem(`projectTasks_${backlog_id}`);
    if (cachedTasks) {
      try {
        const parsedTasks = JSON.parse(cachedTasks);
        console.log(`Loaded ${parsedTasks.length} cached tasks from localStorage for project ${backlog_id}`);
        
        dispatch({
          type: GET_BACKLOG,
          payload: parsedTasks
        });
        
        // Show a warning that we're using cached data
        dispatch({
          type: GET_ERRORS,
          payload: { 
            warning: "Showing cached data. Some information may be outdated." 
          }
        });
        
        return;
      } catch (parseErr) {
        console.error("Error parsing cached tasks:", parseErr);
      }
    }
    
    // If no cache or cache error, provide empty backlog to avoid rendering errors
    dispatch({
      type: GET_BACKLOG,
      payload: []
    });
  }
};

export const getProjectTask = (
  backlog_id,
  pt_id,
  history
) => async dispatch => {
  try {
    const res = await axios.get(`/api/backlog/${backlog_id}/${pt_id}`);
    dispatch({
      type: GET_PROJECT_TASK,
      payload: res.data
    });
  } catch (err) {
    history.push("/dashboard");
  }
};

export const updateProjectTask = (
  backlog_id,
  pt_id,
  project_task,
  history
) => async dispatch => {
  try {
    console.log(`Sending PUT request to /api/backlog/${backlog_id}/${pt_id}`);
    console.log('Project task data:', project_task);
    
    // Using PUT instead of PATCH to avoid CORS issues
    const response = await axios.put(
      `/api/backlog/${backlog_id}/${pt_id}`, 
      project_task,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Update successful:', response.data);
    
    history.push(`/projectBoard/${backlog_id}`);
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
  } catch (err) {
    console.error('Error updating project task:', err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Network Error" }
    });
  }
};

export const deleteProjectTask = (backlog_id, pt_id) => async dispatch => {
  if (
    window.confirm(
      `You are deleting project task ${pt_id}, this action cannot be undone`
    )
  ) {
    try {
      await axios.delete(`/api/backlog/${backlog_id}/${pt_id}`);
      dispatch({
        type: DELETE_PROJECT_TASK,
        payload: pt_id
      });
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response ? err.response.data : { error: "Network Error" }
      });
    }
  }
};

// Added for ProjectManager dashboard to get all backlogs
export const getBacklogs = backlogId => async dispatch => {
  try {
    const res = await axios.get(`/api/backlog/${backlogId}`);
    dispatch({
      type: GET_BACKLOG,
      payload: res.data
    });
    // Return data for async handling
    return res.data;
  } catch (err) {
    // Don't dispatch error for ProjectManager dashboard
    console.log(`Error fetching backlog ${backlogId}:`, err);
    return [];
  }
};
