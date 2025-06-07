import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/securityActions";
import axios from "axios";
import "./Header.css";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      dropdownOpen: false,
      showDeleteConfirm: false,
      deleteError: null,
      isDeleting: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.toggleDeleteConfirm = this.toggleDeleteConfirm.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  closeDropdown = () => {
    this.setState({ dropdownOpen: false });
  };

  toggleDeleteConfirm = () => {
    this.setState(prevState => ({
      showDeleteConfirm: !prevState.showDeleteConfirm,
      deleteError: null
    }));
  };

  async handleDeleteAccount() {
    try {
      this.setState({ isDeleting: true, deleteError: null });
      const { user } = this.props.security;
      
      // Make the delete request
      await axios.delete(`/api/users/${user.id}`);
      
      // Clear any stored user data
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      
      // Logout and redirect
      this.props.logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      this.setState({
        deleteError: error.response?.data || "Failed to delete account. Please try again.",
        isDeleting: false
      });
    }
  }

  logout() {
    this.props.logout();
    window.location.href = "/";
  }

  render() {
    const { validToken, user } = this.props.security;
    const { dropdownOpen, showDeleteConfirm, deleteError, isDeleting } = this.state;

    const userIsAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-tachometer-alt mr-1"></i>
              Project Manager
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/boardManager">
              <i className="fas fa-clipboard-check mr-1"></i>
              Board Manager
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/teams">
              <i className="fas fa-users mr-1"></i>
              Teams
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/projectManager">
              <i className="fas fa-chart-line mr-1"></i>
              Analytics
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <button
              className={`nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent ${dropdownOpen ? 'show' : ''}`}
              id="userDropdown"
              onClick={this.toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="user-avatar bg-white text-primary mr-2">
                <i className="fas fa-user"></i>
              </div>
              <span>{user.fullName}</span>
            </button>
            <div className={`dropdown-menu profile-dropdown dropdown-menu-right shadow ${dropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
              <div className="profile-dropdown-header">
                <div className="user-avatar bg-white text-primary mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                  <i className="fas fa-user fa-2x"></i>
                </div>
                <h6 className="mb-0">{user.fullName}</h6>
                <p className="small mb-0">{user.username}</p>
              </div>
              <div className="profile-dropdown-divider"></div>
              <Link className="dropdown-item profile-dropdown-item" to="/dashboard" onClick={this.closeDropdown}>
                <i className="fas fa-tachometer-alt"></i> Project Manager
              </Link>
              <Link className="dropdown-item profile-dropdown-item" to="/boardManager" onClick={this.closeDropdown}>
                <i className="fas fa-clipboard-check"></i> Board Manager
              </Link>
              <Link className="dropdown-item profile-dropdown-item" to="/profile" onClick={this.closeDropdown}>
                <i className="fas fa-user-cog"></i> Profile Settings
              </Link>
              <div className="profile-dropdown-divider"></div>
              <button
                className="dropdown-item profile-dropdown-item text-danger"
                onClick={this.toggleDeleteConfirm}
              >
                <i className="fas fa-trash-alt"></i> Delete Account
              </button>
              <div className="profile-dropdown-divider"></div>
              <Link
                className="dropdown-item profile-dropdown-item"
                to="/logout"
                onClick={this.logout.bind(this)}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </Link>
            </div>
          </li>
        </ul>

        {showDeleteConfirm && (
          <div className="delete-modal">
            <div className="modal-backdrop" onClick={this.toggleDeleteConfirm}></div>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Account</h5>
                  <button type="button" className="close" onClick={this.toggleDeleteConfirm}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Warning: This action cannot be undone.
                  </div>
                  <p>Are you sure you want to permanently delete your account? All your data will be lost.</p>
                  {deleteError && (
                    <div className="alert alert-danger">
                      <i className="fas fa-times-circle mr-2"></i>
                      {deleteError}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={this.toggleDeleteConfirm}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={this.handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    const userIsNotAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              <i className="fas fa-user-plus mr-1"></i>
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              <i className="fas fa-sign-in-alt mr-1"></i>
              Login
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
      <nav className="navbar navbar-expand-sm navbar-light bg-white mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/">
            <i className="fas fa-project-diagram mr-2"></i>
            Project Manager Pro
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

        {/* Delete Account Modal */}
        {this.state.showDeleteModal && (
          <div className="delete-modal">
            <div className="modal-backdrop" onClick={this.toggleDeleteConfirm}></div>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Account</h5>
                  <button type="button" className="close" onClick={this.toggleDeleteConfirm}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.deleteError && (
                    <div className="alert alert-danger">{this.state.deleteError}</div>
                  )}
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={this.toggleDeleteConfirm}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={this.handleDeleteAccount}
                    disabled={this.state.isDeleting}
                  >
                    {this.state.isDeleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
