import axios from "../axios/axiosConfig";
import { GET_ERRORS, SET_CURRENT_USER, SET_USER_PROFILE } from "./types";
import setJWTToken from "../securityUtils/setJWTToken";
import jwt_decode from "jwt-decode";

// Check if token is expired
const isTokenExpired = token => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};

// Refresh token helper
export const checkAndRefreshToken = () => {
  const token = localStorage.getItem("jwtToken");
  
  if (!token) {
    // No token found, user needs to login
    return false;
  }
  
  if (isTokenExpired(token)) {
    // Token expired, log the user out
    localStorage.removeItem("jwtToken");
    setJWTToken(false);
    // Force page reload to reset application state
    window.location.href = "/login";
    return false;
  }
  
  return true;
};

export const createNewUser = (newUser, history) => async dispatch => {
  try {
    console.log("Registering new user:", newUser.fullName);
    
    // Clear any previous errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Ensure email field is set (use username if not provided)
    if (!newUser.email) {
      newUser.email = newUser.username;
      console.log("Setting email to username:", newUser.email);
    }
    
    const response = await axios.post(`/api/users/register`, newUser);
    console.log("User registered successfully:", response.data);
    
    // Show success message and navigate to login page
    alert("Account registered successfully! Please login.");
    history.push("/login");
    
    return true;
  } catch (err) {
    console.error("Error registering user:", err);
    
    if (err.response) {
      console.log("Server response:", err.response.status, err.response.data);
    }
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response && err.response.data ? err.response.data : {
        error: "Could not register user. Please try again later."
      }
    });
    
    return false;
  }
};

export const login = LoginRequest => async dispatch => {
  try {
    console.log("Attempting login for user:", LoginRequest.username);
    
    // post => Login Request
    const res = await axios.post(`/api/users/login`, LoginRequest);
    console.log("Login successful");
    
    // extract token from res.data
    const { token } = res.data;
    // store the token in the localStorage
    localStorage.setItem("jwtToken", token);
    // set our token in header ***
    setJWTToken(token);
    // decode token on React
    const decoded = jwt_decode(token);
    // dispatch to our securityReducer
    dispatch({
      type: SET_CURRENT_USER,
      payload: decoded
    });
  } catch (err) {
    console.error("Login failed:", err);
    
    // If we have a specific error response from the server, use it
    if (err.response && err.response.data) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    } else {
      // Otherwise, provide a generic error message
      dispatch({
        type: GET_ERRORS,
        payload: {
          error: "Login failed. Please check your credentials and try again."
        }
      });
    }
  }
};

export const logout = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setJWTToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
};

export const getUserProfile = () => async dispatch => {
  try {
    console.log("Fetching user profile");
    
    // Check if token is valid before making the request
    if (!checkAndRefreshToken()) {
      console.log("Token invalid or expired, aborting profile fetch");
      return null;
    }
    
    const res = await axios.get(`/api/users/profile`);
    console.log("User profile fetched successfully");
    
    // Dispatch user profile to Redux store
    dispatch({
      type: SET_USER_PROFILE,
      payload: res.data
    });
    
    // Return the user profile data
    return res.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to fetch user profile" }
    });
    
    return null;
  }
};

export const updateUserProfile = (updatedUser) => async dispatch => {
  try {
    console.log("Updating user profile");
    
    // Check if token is valid before making the request
    if (!checkAndRefreshToken()) {
      console.log("Token invalid or expired, aborting profile update");
      return null;
    }
    
    const res = await axios.put(`/api/users/profile`, updatedUser);
    console.log("User profile updated successfully");
    
    // Dispatch updated profile to Redux store
    dispatch({
      type: SET_USER_PROFILE,
      payload: res.data
    });
    
    // Clear any errors
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    
    // Return the updated user profile
    return res.data;
  } catch (err) {
    console.error("Error updating user profile:", err);
    
    dispatch({
      type: GET_ERRORS,
      payload: err.response ? err.response.data : { error: "Failed to update user profile" }
    });
    
    return null;
  }
};
