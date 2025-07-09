import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
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
      isDeleting: false,
      showQuickCreate: false,
      showNotifications: false,
      showSearch: false,
      searchQuery: '',
      activeNavItem: 'dashboard'
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.toggleDeleteConfirm = this.toggleDeleteConfirm.bind(this);
    this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleQuickCreate = this.toggleQuickCreate.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
    
    // Set active nav item based on current route
    const { location } = this.props;
    this.setActiveNavItem(location.pathname);
  }

  componentWillUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    // Update active nav item when route changes
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setActiveNavItem(this.props.location.pathname);
    }
  }

  setActiveNavItem = (pathname) => {
    if (pathname.includes('/dashboard')) {
      this.setState({ activeNavItem: 'dashboard' });
    } else if (pathname.includes('/projectManager')) {
      this.setState({ activeNavItem: 'projects' });
    } else if (pathname.includes('/teams')) {
      this.setState({ activeNavItem: 'teams' });
    } else if (pathname.includes('/boardManager')) {
      this.setState({ activeNavItem: 'boards' });
    }
  };

  handleClickOutside = (event) => {
    const dropdown = document.getElementById('userDropdown');
    const searchContainer = document.getElementById('searchContainer');
    if (dropdown && !dropdown.contains(event.target)) {
      this.setState({ dropdownOpen: false });
    }
    if (searchContainer && !searchContainer.contains(event.target)) {
      this.setState({ showSearch: false });
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ 
      dropdownOpen: !prevState.dropdownOpen,
      showQuickCreate: false,
      showNotifications: false,
      showSearch: false
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

  toggleQuickCreate = () => {
    this.setState(prev => ({ 
      showQuickCreate: !prev.showQuickCreate,
      showNotifications: false,
      showSearch: false
    }));
  };

  toggleNotifications = () => {
    this.setState(prev => ({ 
      showNotifications: !prev.showNotifications,
      showQuickCreate: false,
      showSearch: false
    }));
  };

  toggleSearch = () => {
    this.setState(prev => ({ 
      showSearch: !prev.showSearch,
      showQuickCreate: false,
      showNotifications: false
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    const { searchQuery } = this.state;
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      this.setState({ showSearch: false, searchQuery: '' });
    }
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
    const { 
      dropdownOpen, 
      showDeleteConfirm, 
      isDeleting, 
      deleteError, 
      showQuickCreate, 
      showNotifications, 
      showSearch,
      searchQuery,
      activeNavItem
    } = this.state;
    
    const userIsAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${activeNavItem === 'dashboard' ? 'active' : ''}`}>
            <Link className="nav-link" to="/dashboard">
              <i className="fas fa-tachometer-alt mr-1"></i>
              <span className="nav-text">Dashboard</span>
              <span className="nav-description">Overview & Analytics</span>
            </Link>
          </li>
          <li className={`nav-item ${activeNavItem === 'projects' ? 'active' : ''}`}>
            <Link className="nav-link" to="/projectManager">
              <i className="fas fa-project-diagram mr-1"></i>
              <span className="nav-text">Project Manager</span>
              <span className="nav-description">Manage Projects & Tasks</span>
            </Link>
          </li>
          <li className={`nav-item ${activeNavItem === 'teams' ? 'active' : ''}`}>
            <Link className="nav-link" to="/teams">
              <i className="fas fa-users mr-1"></i>
              <span className="nav-text">Teams</span>
              <span className="nav-description">Team Management</span>
            </Link>
          </li>
          <li className={`nav-item ${activeNavItem === 'boards' ? 'active' : ''}`}>
            <Link className="nav-link" to="/boardManager">
              <i className="fas fa-clipboard-check mr-1"></i>
              <span className="nav-text">Boards</span>
              <span className="nav-description">Task Boards & Kanban</span>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              <i className="fas fa-info-circle mr-1"></i>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">
              <i className="fas fa-envelope mr-1"></i>
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/privacy">
              <i className="fas fa-shield-alt mr-1"></i>
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    );

    const userIsNotAuthenticated = (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              <i className="fas fa-info-circle mr-1"></i>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">
              <i className="fas fa-envelope mr-1"></i>
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/privacy">
              <i className="fas fa-shield-alt mr-1"></i>
              Privacy
            </Link>
          </li>
        </ul>
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

    // Advanced Search Bar
    const advancedSearchBar = showSearch && (
      <div className="advanced-search-overlay" id="searchContainer">
        <div className="advanced-search-container">
          <div className="search-header">
            <h5><i className="fas fa-search mr-2"></i>Advanced Search</h5>
            <button 
              className="btn btn-link text-muted" 
              onClick={this.toggleSearch}
              aria-label="Close search"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form onSubmit={this.handleSearchSubmit} className="search-form">
            <div className="search-input-group">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search projects, tasks, teams, users..."
                value={searchQuery}
                onChange={this.handleSearchChange}
                autoFocus
              />
              <button type="submit" className="btn btn-primary search-btn">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </form>
          <div className="search-filters">
            <div className="filter-group">
              <label>Filter by:</label>
              <div className="filter-buttons">
                <button type="button" className="btn btn-sm btn-outline-primary">Projects</button>
                <button type="button" className="btn btn-sm btn-outline-primary">Tasks</button>
                <button type="button" className="btn btn-sm btn-outline-primary">Teams</button>
                <button type="button" className="btn btn-sm btn-outline-primary">Users</button>
              </div>
            </div>
          </div>
          <div className="search-shortcuts">
            <h6>Quick Search:</h6>
            <div className="shortcut-buttons">
              <button type="button" className="btn btn-sm btn-light">My Tasks</button>
              <button type="button" className="btn btn-sm btn-light">Recent Projects</button>
              <button type="button" className="btn btn-sm btn-light">Overdue Items</button>
            </div>
          </div>
        </div>
      </div>
    );

    // Quick Create Menu
    const quickCreateMenu = showQuickCreate && (
      <div className="quick-create-dropdown dropdown-menu show shadow-lg">
        <div className="quick-create-header">
          <h6 className="mb-0"><i className="fas fa-plus mr-2"></i>Quick Create</h6>
        </div>
        <div className="quick-create-items">
          <Link className="quick-create-item" to="/addProject" onClick={this.closeDropdown}>
            <div className="quick-create-icon bg-primary">
              <i className="fas fa-folder-plus"></i>
            </div>
            <div className="quick-create-content">
              <h6 className="mb-1">New Project</h6>
              <p className="mb-0 small">Create a new project</p>
            </div>
          </Link>
          <Link className="quick-create-item" to="/createTeam" onClick={this.closeDropdown}>
            <div className="quick-create-icon bg-success">
              <i className="fas fa-users"></i>
            </div>
            <div className="quick-create-content">
              <h6 className="mb-1">New Team</h6>
              <p className="mb-0 small">Create a new team</p>
            </div>
          </Link>
          <Link className="quick-create-item" to="/addProjectTask" onClick={this.closeDropdown}>
            <div className="quick-create-icon bg-info">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="quick-create-content">
              <h6 className="mb-1">New Task</h6>
              <p className="mb-0 small">Add a new task</p>
            </div>
          </Link>
          <Link className="quick-create-item" to="/boardManager" onClick={this.closeDropdown}>
            <div className="quick-create-icon bg-warning">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="quick-create-content">
              <h6 className="mb-1">New Board</h6>
              <p className="mb-0 small">Create a new board</p>
            </div>
          </Link>
        </div>
      </div>
    );

    // Notification Dropdown
    const notificationDropdown = showNotifications && (
      <div className="notification-dropdown dropdown-menu show shadow-lg">
        <div className="notification-header">
          <h6 className="mb-0"><i className="fas fa-bell mr-2"></i>Notifications</h6>
          <button className="btn btn-sm btn-link text-muted">Mark all read</button>
        </div>
        <div className="notification-list">
          <div className="notification-item">
            <div className="notification-icon bg-primary">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="notification-content">
              <p className="mb-1">Project "Dashboard Redesign" completed</p>
              <small className="text-muted">2 minutes ago</small>
            </div>
          </div>
          <div className="notification-item">
            <div className="notification-icon bg-warning">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="notification-content">
              <p className="mb-1">Deadline approaching for "API Integration"</p>
              <small className="text-muted">1 hour ago</small>
            </div>
          </div>
          <div className="notification-item">
            <div className="notification-icon bg-info">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="notification-content">
              <p className="mb-1">New team member joined "Frontend Team"</p>
              <small className="text-muted">3 hours ago</small>
            </div>
          </div>
        </div>
        <div className="notification-footer">
          <Link to="/notifications" className="btn btn-sm btn-outline-primary w-100">
            View All Notifications
          </Link>
        </div>
      </div>
    );

    return (
      <>
        <div className="advanced-navbar-container">
          <nav className="navbar advanced-navbar navbar-expand-lg">
            <div className="container-fluid">
              {/* Brand */}
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <div className="brand-logo">
                  <i className="fas fa-project-diagram"></i>
                </div>
                <div className="brand-text">
                  <span className="brand-title">Project Management</span>
                  <span className="brand-subtitle">Enterprise Tool</span>
                </div>
              </Link>

              {/* Mobile Toggle */}
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#mobile-nav"
                aria-controls="mobile-nav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Navigation Links */}
              {validToken && user ? userIsAuthenticated : userIsNotAuthenticated}

              {/* Right Side Actions */}
              {validToken && user && (
                <div className="navbar-actions d-flex align-items-center">
                  {/* Search Button */}
                  <div className="dropdown mr-2">
                    <button
                      className="btn btn-glass btn-circle"
                      onClick={this.toggleSearch}
                      aria-label="Search"
                      title="Search"
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>

                  {/* Quick Create Button */}
                  <div className="dropdown mr-2">
                    <button
                      className="btn btn-glass btn-circle"
                      onClick={this.toggleQuickCreate}
                      aria-label="Quick create"
                      title="Quick Create"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    {quickCreateMenu}
                  </div>

                  {/* Notification Bell */}
                  <div className="dropdown mr-2">
                    <button
                      className="btn btn-glass btn-circle position-relative"
                      onClick={this.toggleNotifications}
                      aria-label="Notifications"
                      title="Notifications"
                    >
                      <i className="fas fa-bell"></i>
                      <span className="notification-badge">3</span>
                    </button>
                    {notificationDropdown}
                  </div>

                  {/* User Avatar Dropdown */}
                  <div className="dropdown">
                    <button
                      className={`user-avatar-dropdown btn btn-glass d-flex align-items-center ${dropdownOpen ? 'show' : ''}`}
                      id="userDropdown"
                      onClick={this.toggleDropdown}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      title={`${user?.fullName} - Profile Menu`}
                    >
                      <div className="user-avatar">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.fullName || 'User'}
                            className="user-avatar-img"
                          />
                        ) : user?.fullName ? (
                          <span className="user-avatar-text">
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <div className="user-info d-none d-md-block">
                        <div className="user-name">{user?.fullName || 'User'}</div>
                        <div className="user-role">
                          {user?.role || 'Project Manager'}
                        </div>
                      </div>
                      <i className="fas fa-chevron-down dropdown-arrow"></i>
                    </button>
                    
                    <div className={`dropdown-menu profile-dropdown dropdown-menu-right shadow-lg ${dropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
                      <div className="profile-dropdown-header">
                        <div className="user-avatar-large">
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.fullName || 'User'}
                              className="user-avatar-img-large"
                            />
                          ) : user?.fullName ? (
                            <span className="user-avatar-text-large">
                              {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                        <div className="user-details">
                          <h6 className="mb-0">{user?.fullName || 'User'}</h6>
                          <p className="small mb-0 text-muted">{user?.username || 'user@example.com'}</p>
                          <div className="user-status">
                            <span className="status-indicator online"></span>
                            <span className="status-text">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="profile-dropdown-divider"></div>
                      
                      <div className="dropdown-section">
                        <h6 className="dropdown-section-title">
                          <i className="fas fa-tachometer-alt mr-2"></i>Quick Access
                        </h6>
                        <Link className="dropdown-item profile-dropdown-item" to="/dashboard" onClick={this.closeDropdown}>
                          <i className="fas fa-home"></i> Dashboard
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/projectManager" onClick={this.closeDropdown}>
                          <i className="fas fa-tasks"></i> Project Manager
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/teams" onClick={this.closeDropdown}>
                          <i className="fas fa-users"></i> Teams
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/boardManager" onClick={this.closeDropdown}>
                          <i className="fas fa-clipboard-check"></i> Board Manager
                        </Link>
                      </div>
                      
                      <div className="profile-dropdown-divider"></div>
                      
                      <div className="dropdown-section">
                        <h6 className="dropdown-section-title">
                          <i className="fas fa-cog mr-2"></i>Account
                        </h6>
                        <Link className="dropdown-item profile-dropdown-item" to="/profile" onClick={this.closeDropdown}>
                          <i className="fas fa-user-cog"></i> Profile Settings
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/settings" onClick={this.closeDropdown}>
                          <i className="fas fa-cog"></i> Preferences
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/help" onClick={this.closeDropdown}>
                          <i className="fas fa-question-circle"></i> Help & Support
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/notifications" onClick={this.closeDropdown}>
                          <i className="fas fa-bell"></i> Notifications
                          <span className="notification-count">3</span>
                        </Link>
                      </div>
                      
                      <div className="dropdown-section">
                        <h6 className="dropdown-section-title">
                          <i className="fas fa-info-circle mr-2"></i>Information
                        </h6>
                        <Link className="dropdown-item profile-dropdown-item" to="/about" onClick={this.closeDropdown}>
                          <i className="fas fa-info-circle"></i> About Us
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/contact" onClick={this.closeDropdown}>
                          <i className="fas fa-envelope"></i> Contact Us
                        </Link>
                        <Link className="dropdown-item profile-dropdown-item" to="/privacy" onClick={this.closeDropdown}>
                          <i className="fas fa-shield-alt"></i> Privacy Policy
                        </Link>
                      </div>
                      
                      <div className="profile-dropdown-divider"></div>
                      
                      <div className="dropdown-section">
                        <h6 className="dropdown-section-title">
                          <i className="fas fa-shield-alt mr-2"></i>Security
                        </h6>
                        <button
                          className="dropdown-item profile-dropdown-item text-warning"
                          onClick={this.toggleDeleteConfirm}
                        >
                          <i className="fas fa-trash-alt"></i> Delete Account
                        </button>
                      </div>
                      
                      <div className="profile-dropdown-divider"></div>
                      
                      <button
                        className="dropdown-item profile-dropdown-item logout-item"
                        onClick={this.logout.bind(this)}
                      >
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Advanced Search Overlay */}
          {advancedSearchBar}

          {/* Delete Account Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal fade show d-block" tabIndex="-1" role="dialog">
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
        <style>{`
          .navbar, .advanced-navbar {
            background: var(--color-card-bg) !important;
            color: var(--color-primary) !important;
            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
            backdrop-filter: blur(12px);
            border-radius: 1.5em;
            margin-top: 1em;
            margin-bottom: 2em;
            padding: 0.5em 1.5em;
            transition: background 0.3s, box-shadow 0.3s;
          }
          .navbar .navbar-brand, .advanced-navbar .navbar-brand {
            color: var(--color-primary) !important;
            font-weight: 900;
            letter-spacing: 1px;
            font-size: 1.5rem;
            font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
            display: flex;
            align-items: center;
          }
          .navbar .navbar-brand:hover, .advanced-navbar .navbar-brand:hover {
            color: var(--color-secondary) !important;
          }
          .brand-logo {
            font-size: 2em;
            color: var(--color-secondary);
            margin-right: 0.7em;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--clouded-pearl);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
          }
          .brand-title {
            font-size: 1.3rem;
            font-weight: 900;
            color: var(--color-primary);
            font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
          }
          .brand-subtitle {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            font-weight: 500;
            margin-left: 2px;
          }
          .navbar .nav-link, .advanced-navbar .nav-link {
            color: var(--color-secondary) !important;
            font-weight: 600;
            font-size: 1.08rem;
            transition: color 0.2s;
            font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
            position: relative;
            padding: 0.75rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            min-width: 120px;
          }
          .navbar .nav-link.active, .navbar .nav-link:focus, .navbar .nav-link:hover,
          .advanced-navbar .nav-link.active, .advanced-navbar .nav-link:focus, .advanced-navbar .nav-link:hover {
            color: var(--color-primary) !important;
            text-decoration: none;
            background: rgba(255,255,255,0.1);
            border-radius: 0.75rem;
          }
          .nav-text {
            font-size: 0.9rem;
            font-weight: 600;
          }
          .nav-description {
            font-size: 0.7rem;
            color: var(--color-text-muted);
            margin-top: 0.2rem;
          }
          .btn-glass {
            background: rgba(255,255,255,0.18);
            color: var(--color-secondary);
            border: none;
            border-radius: 50%;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
            transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            margin-right: 0.5em;
          }
          .btn-glass:hover, .btn-glass:focus {
            background: var(--color-secondary);
            color: var(--midnight-mist);
            box-shadow: 0 4px 16px 0 rgba(0,0,0,0.13);
            transform: scale(1.08);
          }
          .btn-circle {
            border-radius: 50% !important;
            padding: 0 !important;
          }
          .user-avatar {
            background: var(--color-card-alt);
            color: var(--color-secondary);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
          }
          .advanced-navbar-container {
            background: transparent;
          }
          .advanced-search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(8px);
            z-index: 1050;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .advanced-search-container {
            background: var(--color-card-bg);
            border-radius: 1.5rem;
            padding: 2rem;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }
          .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          .search-input-group {
            position: relative;
            margin-bottom: 1.5rem;
          }
          .search-input {
            padding-left: 3rem;
            padding-right: 3rem;
            border-radius: 1rem;
            border: 2px solid var(--color-border);
            background: var(--color-card-alt);
            font-size: 1.1rem;
          }
          .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-muted);
          }
          .search-btn {
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 0.75rem;
            padding: 0.5rem 1rem;
          }
          .search-filters {
            margin-bottom: 1.5rem;
          }
          .filter-group {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .filter-buttons {
            display: flex;
            gap: 0.5rem;
          }
          .search-shortcuts {
            border-top: 1px solid var(--color-border);
            padding-top: 1rem;
          }
          .shortcut-buttons {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--color-secondary);
            color: var(--midnight-mist);
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          }
        `}</style>
      </>
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

export default withRouter(connect(
  mapStateToProps,
  { logout }
)(Header));
