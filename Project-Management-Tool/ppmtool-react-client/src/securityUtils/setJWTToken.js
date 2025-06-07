import axios from "axios";

const setJWTToken = token => {
  if (token) {
    // Add token to all future requests
    axios.defaults.headers.common["Authorization"] = token;
    console.log("JWT Token set in axios headers:", token);
  } else {
    // Remove token if it exists
    delete axios.defaults.headers.common["Authorization"];
    console.log("JWT Token removed from axios headers");
  }
};

export default setJWTToken;
