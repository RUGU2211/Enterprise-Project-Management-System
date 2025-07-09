import React, { Component } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Layout/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
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
import About from "./components/Layout/About";
import Contact from "./components/Layout/Contact";
import Privacy from "./components/Layout/Privacy";
import jwt_decode from "jwt-decode";
import setJWTToken from "./securityUtils/setJWTToken";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import SecureRoute from "./securityUtils/SecureRoute";
import TeamDashboard from "./components/Team/TeamDashboard";
import UpdateTeam from "./components/Team/UpdateTeam";
import Profile from "./components/UserManagement/Profile";
import TeamManage from "./components/Team/TeamManage";
import BoardManager from "./components/BoardManager/BoardManager";
import ProjectManager from "./components/Dashboard/ProjectManager";
import CreateTeam from "./components/Team/CreateTeam";
import AnimatedBackground from "./components/common/AnimatedBackground";
import Footer from './components/Layout/Footer';

// Background controller component
class BackgroundController extends Component {
  componentDidMount() {
    this.updateBackgroundClass();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateBackgroundClass();
    }
  }

  updateBackgroundClass() {
    const { pathname } = this.props.location;
    
    // Remove all background classes first
    document.body.classList.remove(
      'dashboard-page', 
      'add-project-page', 
      'update-project-page', 
      'project-board-page', 
      'project-manager-page'
    );
    
    // Add the appropriate class based on the route
    if (pathname === '/dashboard') {
      document.body.classList.add('dashboard-page');
    } else if (pathname === '/addProject') {
      document.body.classList.add('add-project-page');
    } else if (pathname.includes('/updateProject/')) {
      document.body.classList.add('update-project-page');
    } else if (pathname.includes('/projectBoard/')) {
      document.body.classList.add('project-board-page');
    } else if (pathname === '/projectManager') {
      document.body.classList.add('project-manager-page');
    }
  }

  render() {
    return this.props.children;
  }
}

const BackgroundControllerWithRouter = withRouter(BackgroundController);

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
          <BackgroundControllerWithRouter>
            <div className="App d-flex flex-column min-vh-100">
              {/* Enhanced Animated Background */}
              <AnimatedBackground />
              
              <Header />
              <div className="main-content fade-in">
                <Switch>
                  {/* Public Routes */}
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/contact" component={Contact} />
                  <Route exact path="/privacy" component={Privacy} />

                  {/* Private Routes */}
                  <SecureRoute exact path="/dashboard" component={Dashboard} />
                  <SecureRoute exact path="/addProject" component={AddProject} />
                  <SecureRoute exact path="/updateProject/:id" component={UpdateProject} />
                  <SecureRoute exact path="/projectBoard/:id" component={ProjectBoard} />
                  <SecureRoute exact path="/addProjectTask/:id" component={AddProjectTask} />
                  <SecureRoute exact path="/updateProjectTask/:backlog_id/:pt_id" component={UpdateProjectTask} />
                  
                  {/* Team Management Routes */}
                  <SecureRoute exact path="/teams" component={TeamDashboard} />
                  <SecureRoute exact path="/createTeam" component={CreateTeam} />
                  <SecureRoute exact path="/team/:id" component={TeamManage} />
                  <SecureRoute exact path="/boardManager" component={BoardManager} />
                  <SecureRoute exact path="/updateTeam/:id" component={UpdateTeam} />
                  
                  {/* User Profile Route */}
                  <SecureRoute exact path="/profile" component={Profile} />

                  {/* New Project Manager Route */}
                  <SecureRoute exact path="/projectManager" component={ProjectManager} />
                </Switch>
              </div>
              <Footer />
            </div>
          </BackgroundControllerWithRouter>
        </Router>
      </Provider>
    );
  }
}

export default App;
