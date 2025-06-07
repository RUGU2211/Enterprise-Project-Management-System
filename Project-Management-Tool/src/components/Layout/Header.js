import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/securityActions";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      darkMode: localStorage.getItem('darkMode') === 'true'
    };
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
  }

  componentDidMount() {
    this.applyDarkMode();
  }

  toggleDarkMode() {
    const newDarkMode = !this.state.darkMode;
    this.setState({ darkMode: newDarkMode }, () => {
      localStorage.setItem('darkMode', newDarkMode);
      this.applyDarkMode();
    });
  }

  applyDarkMode() {
    if (this.state.darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  logout() {
    this.props.logout();
    window.location.href = "/";
  }

  render() {
    const { validToken, user } = this.props.security;
    const { darkMode } = this.state;

    const userIsAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user-circle mr-1"></i>
              {user.fullName}
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" to="/profile">
                <i className="fas fa-user-cog mr-2"></i>Profile
              </Link>
              <div className="dropdown-divider"></div>
              <a
                className="dropdown-item"
                href=""
                onClick={this.logout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </a>
            </div>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-link nav-link"
              onClick={this.toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fas fa-${darkMode ? "sun" : "moon"}`}></i>
            </button>
          </li>
        </ul>
      </div>
    );

    const userIsNotAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button 
              className="btn btn-link nav-link"
              onClick={this.toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              <i className="fas fa-user-plus mr-1"></i> Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              <i className="fas fa-sign-in-alt mr-1"></i> Login
            </Link>
          </li>
        </ul>
      </div>
    );

    let headerLinks;

    if (validToken && user) {
      headerLinks = userIsAuthenticated;
    } else {
      headerLinks = userIsNotAuthenticated;
    }

    return (
      <nav className={`navbar navbar-expand-sm ${darkMode ? 'navbar-dark bg-dark' : 'navbar-dark bg-primary'} mb-4`}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <div className="d-flex align-items-center">
              <i className="fas fa-clipboard-list mr-2"></i>
              <div>
                <span className="font-weight-bold">Project</span>
                <span className="font-weight-light">Manager</span>
              </div>
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          {headerLinks}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(
  mapStateToProps,
  { logout }
)(Header); 