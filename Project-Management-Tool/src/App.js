import React, { Component } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddProject from "./components/Project/AddProject";
import { Provider } from "react-redux";
import store from "./store";
import UpdateProject from "./components/Project/UpdateProject";
import ProjectBoard from "./components/ProjectBoard/ProjectBoard";
import AddProjectTask from "./components/ProjectBoard/ProjectTasks/AddProjectTask";
import UpdateProjectTask from "./components/ProjectBoard/ProjectTasks/UpdateProjectTask";
import Landing from "./components/Layout/Landing";
import Register from "./components/UserManagement/Register";
import Login from "./components/UserManagement/Login";
import Terms from "./components/UserManagement/Terms";
import Privacy from "./components/UserManagement/Privacy";
import jwt_decode from "jwt-decode";
import setJWTToken from "./securityUtils/setJWTToken";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import SecureRoute from "./securityUtils/SecureRoute";

const jwtToken = localStorage.getItem("jwtToken");

if (jwtToken) {
  setJWTToken(jwtToken);
  const decoded_jwtToken = jwt_decode(jwtToken);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded_jwtToken
  });

  const currentTime = Date.now() / 1000;
  if (decoded_jwtToken.exp < currentTime) {
    // Token is expired
    store.dispatch(logout());
    window.location.href = "/login?expired=true";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header />
            <Switch>
              {/* Public Routes */}
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/terms" component={Terms} />
              <Route exact path="/privacy" component={Privacy} />

              {/* Private Routes */}
              <SecureRoute exact path="/dashboard" component={Dashboard} />
              <SecureRoute exact path="/addProject" component={AddProject} />
              <SecureRoute exact path="/updateProject/:id" component={UpdateProject} />
              <SecureRoute exact path="/projectBoard/:id" component={ProjectBoard} />
              <SecureRoute exact path="/addProjectTask/:id" component={AddProjectTask} />
              <SecureRoute exact path="/updateProjectTask/:backlog_id/:pt_id" component={UpdateProjectTask} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App; 