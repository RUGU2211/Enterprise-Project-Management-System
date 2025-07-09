import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getTeam, addTeamMember, addProjectToTeam, removeProjectFromTeam, removeTeamMember, changeTeamMemberRole, getUsers } from "../../actions/teamActions";
import { getProjects } from "../../actions/projectActions";
import classnames from "classnames";

class TeamManage extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: "members", // "members" or "projects"
      newMemberId: "",
      newMemberRole: "MEMBER",
      selectedProjectId: "",
      loading: true,
      users: [],
      editingMemberId: null,
      editingMemberRole: "MEMBER",
      editingMemberUsername: null,
      showSuccessToast: false,
      successMessage: "",
      errors: {}
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const urlParams = new URLSearchParams(window.location.search);
    const invitedUserId = urlParams.get('userId');
    const invitedRole = urlParams.get('role') || 'MEMBER';
    
    this.setState({ loading: true });
    
    // If there's an invited user from email, add them to the team
    if (invitedUserId) {
      const memberData = {
        userId: parseInt(invitedUserId),
        role: invitedRole
      };
      
      this.props.addTeamMember(id, memberData)
        .then(() => {
          this.showSuccessToast("Welcome! You've been added to the team.");
          return this.props.getTeam(id, this.props.history);
        })
        .catch(err => {
          console.error("Error adding invited member:", err);
          if (err.response?.data === "User is already a member of this team") {
            this.showSuccessToast("You are already a member of this team!");
          } else {
            this.setState({
              errors: { team: "Failed to add you to the team. Please try again." }
            });
          }
        });
    }
    
    // Load initial data
    Promise.all([
      this.props.getTeam(id, this.props.history),
      this.props.getProjects(),
      this.fetchUsers()
    ])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error("Error loading initial data:", error);
        if (error.response?.data?.projectNotFound) {
          this.setState({ 
            loading: false,
            errors: { team: "Team not found or you don't have access to it" }
          });
        } else {
          this.setState({ 
            loading: false,
            errors: { team: "Error loading team data" }
          });
        }
        
        setTimeout(() => {
          this.props.history.push("/teams");
        }, 3000);
      });
  }
  
  // Separate method to fetch users
  async fetchUsers() {
    try {
      console.log("Fetching users for TeamManage component");
      const users = await this.props.getUsers();
      
      if (users && users.length > 0) {
        console.log("Users fetched successfully:", users);
        this.setState({ users });
      } else {
        console.warn("No users returned from getUsers");
        // Keep the users array empty, will show appropriate UI message
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    
    // If the team has changed, update the UI
    if (JSON.stringify(nextProps.team) !== JSON.stringify(this.props.team)) {
      this.setState({ loading: false });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onAddMember = async (e) => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { newMemberId, newMemberRole } = this.state;
    
    if (!newMemberId) {
      this.setState({ errors: { newMemberId: "Please select a user" } });
      return;
    }
    
    const memberData = {
      userId: parseInt(newMemberId),
      role: newMemberRole
    };
    
    // Show loading state
    this.setState({ loading: true });
    
    try {
      // Add the team member
      await this.props.addTeamMember(id, memberData);
      
      // Clear the form
      this.setState({ 
        newMemberId: "", 
        newMemberRole: "MEMBER",
        errors: {}
      });
      
      // Refresh the team data to show the new member
      await this.props.getTeam(id, this.props.history);
      
      // Show success message
      this.showSuccessToast("Team member added successfully");
      this.setState({ loading: false });
      
    } catch (err) {
      console.error("Error adding team member:", err);
      // Handle the case when user is already a member
      if (err.response && err.response.data === "User is already a member of this team") {
        this.setState({
          errors: { newMemberId: "This user is already a member of the team" },
          loading: false
        });
      } else {
        this.setState({
          errors: err.response?.data || { error: "Failed to add team member" },
          loading: false
        });
      }
    }
  };

  // Show a success toast and hide it after 3 seconds
  showSuccessToast = (message) => {
    this.setState({ 
      showSuccessToast: true,
      successMessage: message
    });
    
    setTimeout(() => {
      this.setState({ 
        showSuccessToast: false,
        successMessage: ""
      });
    }, 3000);
  }

  onAddProject = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { selectedProjectId } = this.state;
    
    if (!selectedProjectId) {
      this.setState({ errors: { selectedProjectId: "Please select a project" } });
      return;
    }
    
    // Find the selected project name for feedback
    const selectedProject = this.props.project.projects.find(
      p => p.projectIdentifier === selectedProjectId
    );
    const projectName = selectedProject ? selectedProject.projectName : selectedProjectId;
    
    // Show loading state
    this.setState({ loading: true });
    
    // Now selectedProjectId contains the projectIdentifier directly
    this.props.addProjectToTeam(id, selectedProjectId)
      .then(success => {
        if (success) {
          // Refresh the team data to ensure we have the latest projects
          return this.props.getTeam(id, this.props.history);
        }
      })
      .then(() => {
        this.showSuccessToast(`Added "${projectName}" to the team`);
        this.setState({ 
          selectedProjectId: "", 
          errors: {},
          loading: false 
        });
      })
      .catch(error => {
        console.error("Error adding project to team:", error);
        this.setState({ loading: false });
      });
  };
  
  onRemoveProject = (project, event) => {
    // If event exists, prevent default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const { id } = this.props.match.params;
    const projectName = project.projectName || project.projectIdentifier;
    const projectId = project.projectIdentifier;
    
    console.log(`Attempting to remove project ${projectId} (${projectName}) from team ${id}`);
    
    if (window.confirm(`Are you sure you want to remove "${projectName}" from the team?`)) {
      // Show loading state
      this.setState({ loading: true });
      
      // Optimistically update the UI first for immediate feedback
      const currentTeam = {...this.props.team.team};
      
      if (currentTeam.projects && currentTeam.projects.length > 0) {
        // Filter out the project being removed
        currentTeam.projects = currentTeam.projects.filter(p => 
          p.projectIdentifier !== projectId && 
          p.projectIdentifier !== projectId.toUpperCase()
        );
        
        // Update Redux state with the updated team
        this.props.team.team = currentTeam;
      }
      
      // Then call the API to persist the change
      this.props.removeProjectFromTeam(id, projectId)
        .then(success => {
          console.log(`Remove project result: ${success ? 'success' : 'failed'}`);
          if (success) {
            // Show success message
            this.showSuccessToast(`Removed "${projectName}" from the team`);
            
            // Get fresh team data to ensure everything is in sync
            return this.props.getTeam(id, this.props.history);
          } else {
            // If the API call failed, revert the optimistic update
            console.error("API call to remove project failed, refreshing team data");
            return this.props.getTeam(id, this.props.history);
          }
        })
        .then(() => {
          this.setState({ loading: false });
        })
        .catch(error => {
          console.error("Error removing project from team:", error);
          this.setState({ loading: false });
          
          // In case of error, refresh team data to ensure UI is in sync
          this.props.getTeam(id, this.props.history);
        });
    } else {
      console.log("Project removal cancelled by user");
    }
  };

  onRemoveMember = (member) => {
    const { id } = this.props.match.params;
    if (window.confirm(`Are you sure you want to remove ${member.fullName} from the team?`)) {
      this.props.removeTeamMember(id, member.username);
    }
  };
  
  onStartEditMemberRole = (member) => {
    this.setState({
      editingMemberId: member.id,
      editingMemberRole: member.role,
      editingMemberUsername: member.username
    });
  };
  
  onCancelEditMemberRole = () => {
    this.setState({
      editingMemberId: null,
      editingMemberRole: "MEMBER",
      editingMemberUsername: null
    });
  };
  
  onChangeEditingMemberRole = (e) => {
    this.setState({
      editingMemberRole: e.target.value
    });
  };
  
  onSaveMemberRole = (memberId) => {
    const { id } = this.props.match.params;
    const { editingMemberRole, editingMemberUsername } = this.state;
    
    this.props.changeTeamMemberRole(id, editingMemberUsername, editingMemberRole);
    this.setState({
      editingMemberId: null,
      editingMemberRole: "MEMBER",
      editingMemberUsername: null
    });
  };

  changeTab = tab => {
    this.setState({ activeTab: tab });
    
    // Refresh team data when switching to projects tab
    if (tab === "projects") {
      const { id } = this.props.match.params;
      this.setState({ loading: true });
      this.props.getTeam(id, this.props.history)
        .then(() => {
          console.log("Projects refreshed successfully");
          this.setState({ loading: false });
        })
        .catch(error => {
          console.error("Error refreshing projects:", error);
          this.setState({ loading: false });
        });
    }
  };

  // Dedicated handler for removing projects from the dedicated remove section
  handleProjectRemove = (project, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const { id } = this.props.match.params;
    const projectName = project.projectName || project.projectIdentifier;
    const projectId = project.projectIdentifier;
    
    // Use more direct confirmation wording
    if (window.confirm(`Are you sure you want to remove "${projectName}" from this team? This action cannot be undone.`)) {
      // Visual feedback - fade out the card
      const cardElement = event.currentTarget.closest('.col-md-4');
      if (cardElement) {
        cardElement.style.opacity = '0.5';
        cardElement.style.transition = 'opacity 0.3s';
      }
      
      // Update state to show loading
      this.setState({ loading: true });
      
      // Immediately update UI by filtering team projects
      const currentTeam = {...this.props.team.team};
      
      if (currentTeam.projects && currentTeam.projects.length > 0) {
        // Filter out the project being removed
        const filteredProjects = currentTeam.projects.filter(p => 
          p.projectIdentifier !== projectId && 
          p.projectIdentifier !== projectId.toUpperCase()
        );
        
        // Update the team object
        currentTeam.projects = filteredProjects;
        this.props.team.team = currentTeam;
        
        // Show immediate feedback
        this.showSuccessToast(`Removing "${projectName}" from the team...`);
      }
      
      // Call the redux action to persist the change
      this.props.removeProjectFromTeam(id, projectId)
        .then(success => {
          if (success) {
            this.showSuccessToast(`Successfully removed "${projectName}" from the team`);
            return this.props.getTeam(id, this.props.history);
          } else {
            console.error("Failed to remove project, refreshing data");
            return this.props.getTeam(id, this.props.history);
          }
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  };

  render() {
    const { team } = this.props.team;
    const { projects } = this.props.project;
    const { errors, activeTab, loading, users, showSuccessToast, successMessage } = this.state;

    if (loading) {
      return (
        <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <h5 className="text-muted">Loading team information...</h5>
          </div>
        </div>
      );
    }

    // Show error state if team not found
    if (errors.team) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger text-center">
            <h4 className="alert-heading">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Error Loading Team
            </h4>
            <p>{errors.team}</p>
            <hr />
            <p className="mb-0">
              Redirecting to teams page...
              <div className="spinner-border spinner-border-sm ml-2" role="status">
                <span className="sr-only">Redirecting...</span>
              </div>
            </p>
          </div>
        </div>
      );
    }

    // Show error if team data is not available
    if (!team || !team.id) {
      return (
        <div className="container mt-5">
          <div className="alert alert-warning text-center">
            <h4 className="alert-heading">
              <i className="fas fa-exclamation-circle mr-2"></i>
              Team Not Found
            </h4>
            <p>The requested team could not be found or you don't have access to it.</p>
            <hr />
            <p className="mb-0">
              Redirecting to teams page...
              <div className="spinner-border spinner-border-sm ml-2" role="status">
                <span className="sr-only">Redirecting...</span>
              </div>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="team-manage bg-light py-4">
        {/* Success Toast */}
        {showSuccessToast && (
          <div 
            className="alert alert-success shadow" 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              borderRadius: '4px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              animation: 'fadeIn 0.3s, slideIn 0.4s'
            }}
          >
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        )}
        
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/teams" className="btn btn-light mb-3 shadow-sm">
                <i className="fas fa-arrow-left mr-1"></i> Back to Teams
              </Link>
              
              <div className="card shadow border-0 rounded mb-4">
                <div className="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                  <h1 className="h3 mb-0 text-gray-800">
                    <i className="fas fa-users-cog mr-2 text-primary"></i>
                    {team.name}
                  </h1>
                  
                  <div>
                    <Link to={`/team/${team.id}`} className="btn btn-outline-info mr-2">
                      <i className="fas fa-info-circle mr-1"></i> View Details
                </Link>
                <Link to={`/updateTeam/${team.id}`} className="btn btn-primary">
                      <i className="fas fa-edit mr-1"></i> Edit Team
                </Link>
                  </div>
              </div>
              
              {/* Tabs Navigation */}
                <ul className="nav nav-tabs nav-fill">
                <li className="nav-item">
                  <button
                      className={classnames("nav-link rounded-0 py-3", {
                      active: activeTab === "members"
                    })}
                    onClick={() => this.changeTab("members")}
                  >
                      <i className="fas fa-users mr-2"></i>
                    Team Members
                  </button>
                </li>
                <li className="nav-item">
                  <button
                      className={classnames("nav-link rounded-0 py-3", {
                      active: activeTab === "projects"
                    })}
                    onClick={() => this.changeTab("projects")}
                  >
                      <i className="fas fa-tasks mr-2"></i>
                    <span className="font-weight-bold text-dark">Team Projects</span>
                      {team.projects && team.projects.length > 0 && (
                        <span className="ml-2 badge badge-primary badge-pill">
                          {team.projects.length}
                        </span>
                      )}
                  </button>
                </li>
              </ul>
              
              {/* Members Tab Content */}
              {activeTab === "members" && (
                  <div className="tab-content p-4 border-0 rounded-bottom bg-white">
                  <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 font-weight-bold">
                              <i className="fas fa-user-plus text-primary mr-2"></i>
                              Add Team Member
                            </h5>
                          </div>
                          <div className="card-body">
                      <form onSubmit={this.onAddMember} className="form-inline">
                        <div className="form-group mr-2 mb-2">
                          <select
                                  className={classnames("form-control shadow-sm", {
                              "is-invalid": errors.newMemberId
                            })}
                            name="newMemberId"
                            value={this.state.newMemberId}
                            onChange={this.onChange}
                            disabled={users.length === 0}
                          >
                            <option value="">Select User</option>
                            {users.length > 0 ? (
                              users.map(user => (
                                <option key={user.id} value={user.id}>
                                  {user.fullName} ({user.username})
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>No users found in database</option>
                            )}
                          </select>
                          {errors.newMemberId && (
                            <div className="invalid-feedback">{errors.newMemberId}</div>
                          )}
                          {users.length === 0 && !errors.newMemberId && (
                            <small className="form-text text-danger">
                              No users found in database. You need to register users in the system before you can add them to your team.
                            </small>
                          )}
                        </div>
                        <div className="form-group mr-2 mb-2">
                          <select
                                  className="form-control shadow-sm"
                            name="newMemberRole"
                            value={this.state.newMemberRole}
                            onChange={this.onChange}
                            disabled={users.length === 0}
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                              <button type="submit" className="btn btn-success shadow-sm mb-2" disabled={users.length === 0}>
                          <i className="fas fa-user-plus mr-1"></i> Add Member
                        </button>
                      </form>
                          </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 font-weight-bold">
                              <i className="fas fa-users text-primary mr-2"></i>
                              Team Members
                            </h5>
                          </div>
                          <div className="card-body">
                      {team.members && team.members.length > 0 ? (
                        <div className="table-responsive">
                                <table className="table table-hover">
                                  <thead className="bg-light">
                              <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Joined</th>
                                      <th className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.members.map(member => (
                                      <tr key={member.id || member.username} className="align-middle">
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="member-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-2" style={{ width: "36px", height: "36px", fontSize: "1rem" }}>
                                              {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <span>{member.fullName}</span>
                                          </div>
                                        </td>
                                  <td>{member.username}</td>
                                  <td>
                                    {this.state.editingMemberId === member.id ? (
                                      <select
                                        className="form-control form-control-sm"
                                        value={this.state.editingMemberRole}
                                        onChange={this.onChangeEditingMemberRole}
                                      >
                                        <option value="MEMBER">Member</option>
                                        <option value="ADMIN">Admin</option>
                                      </select>
                                    ) : (
                                      <span className={`badge badge-${
                                        member.role === "ADMIN" ? "danger" :
                                        member.role === "OWNER" ? "primary" : 
                                        "info"
                                      } py-1 px-2`}>
                                        {member.role}
                                      </span>
                                    )}
                                  </td>
                                  <td>{member.joinedAt}</td>
                                        <td className="text-center">
                                    {member.role !== "OWNER" && (
                                      <div className="btn-group btn-group-sm">
                                        {this.state.editingMemberId === member.id ? (
                                          <>
                                            <button
                                              className="btn btn-success btn-sm"
                                              onClick={() => this.onSaveMemberRole(member.id)}
                                            >
                                              <i className="fas fa-check"></i>
                                            </button>
                                            <button
                                              className="btn btn-secondary btn-sm"
                                              onClick={this.onCancelEditMemberRole}
                                            >
                                              <i className="fas fa-times"></i>
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                                    className="btn btn-outline-warning btn-sm mr-1"
                                              onClick={() => this.onStartEditMemberRole(member)}
                                                    title="Edit Role"
                                            >
                                              <i className="fas fa-user-edit"></i>
                                            </button>
                                            <button
                                                    className="btn btn-outline-danger btn-sm"
                                              onClick={() => this.onRemoveMember(member)}
                                                    title="Remove Member"
                                            >
                                              <i className="fas fa-user-minus"></i>
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-info">
                                <i className="fas fa-info-circle mr-2"></i>
                          No team members found. Add members using the form above.
                        </div>
                      )}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Projects Tab Content */}
              {activeTab === "projects" && (
                  <div className="tab-content p-4 border-0 rounded-bottom bg-white">
                    {/* Projects Summary Card */}
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div className="card bg-gradient-primary text-white shadow-sm border-0 rounded">
                          <div className="card-body d-flex justify-content-between align-items-center py-3">
                            <div>
                              <h5 className="card-title mb-1 font-weight-bold">
                                <i className="fas fa-project-diagram mr-2"></i>
                                Team Projects
                              </h5>
                              <p className="card-text mb-0 opacity-75">
                                Projects assigned to team "{team.name}"
                              </p>
                            </div>
                            <div 
                              className="badge badge-light badge-pill shadow-sm"
                              style={{
                                animation: this.state.showSuccessToast ? 'pulse 1s' : 'none',
                                fontSize: '1.1rem',
                                padding: '0.5rem 1.2rem'
                              }}
                            >
                              <i className="fas fa-clipboard-list mr-1"></i>
                              {team.projects && team.projects.length > 0 ? 
                                `${team.projects.length} Project${team.projects.length !== 1 ? 's' : ''}` : 
                                'No Projects'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-header bg-light">
                            <h5 className="mb-0 font-weight-bold">
                              <i className="fas fa-plus-circle text-success mr-2"></i>
                              Add Project to Team
                            </h5>
                          </div>
                          <div className="card-body">
                            <p className="text-muted">
                              <i className="fas fa-info-circle mr-1"></i>
                              You can add multiple projects to this team. Projects already assigned to the team will be disabled in the dropdown.
                            </p>
                            <form onSubmit={this.onAddProject} className="form-row align-items-end">
                              <div className="col-md-8 col-sm-8 mb-2">
                                <label htmlFor="selectedProjectId" className="font-weight-bold">Select a Project:</label>
                          <select
                                  id="selectedProjectId"
                                  className={classnames("form-control shadow-sm", {
                              "is-invalid": errors.selectedProjectId
                            })}
                            name="selectedProjectId"
                            value={this.state.selectedProjectId}
                            onChange={this.onChange}
                          >
                                  <option value="">-- Select a project to add --</option>
                                  {projects.length === 0 && (
                                    <option value="" disabled>No available projects found</option>
                                  )}
                                  {projects.map(project => {
                                    // Check if project is already in team
                                    const isProjectInTeam = team.projects && 
                                      team.projects.some(p => p.projectIdentifier === project.projectIdentifier);
                                    
                                    return (
                                      <option 
                                        key={project.projectIdentifier || project.id} 
                                        value={project.projectIdentifier}
                                        disabled={isProjectInTeam}
                                      >
                                {project.projectName} ({project.projectIdentifier})
                                        {isProjectInTeam ? ' - Already in team' : ''}
                              </option>
                                    );
                                  })}
                          </select>
                          {errors.selectedProjectId && (
                            <div className="invalid-feedback">{errors.selectedProjectId}</div>
                          )}
                        </div>
                              <div className="col-md-4 col-sm-4 mb-2">
                                <button type="submit" className="btn btn-success btn-block shadow-sm">
                          <i className="fas fa-plus-circle mr-1"></i> Add Project
                        </button>
                              </div>
                      </form>
                          </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow-sm border-0">
                          <div className="card-header bg-light d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 font-weight-bold">
                              <i className="fas fa-list text-primary mr-2"></i>
                              Project List
                            </h5>
                            {team.projects && team.projects.length > 0 && (
                              <span className="badge badge-primary badge-pill py-1 px-2">
                                {team.projects.length} Project{team.projects.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <div className="card-body">
                            <style>
                              {`
                                @keyframes pulse {
                                  0% { transform: scale(1); }
                                  50% { transform: scale(1.2); }
                                  100% { transform: scale(1); }
                                }
                                
                                .project-table {
                                  border-collapse: separate;
                                  border-spacing: 0;
                                }
                                
                                .project-table tr {
                                  transition: all 0.2s ease;
                                }
                                
                                .project-table tr:hover {
                                  background-color: rgba(0,123,255,0.05) !important;
                                }
                                
                                .project-card {
                                  transition: all 0.3s ease;
                                  border-radius: 0.5rem;
                                  overflow: hidden;
                                }
                                
                                .project-card:hover {
                                  transform: translateY(-3px);
                                  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
                                }
                                
                                .btn-action {
                                  transition: all 0.2s;
                                }
                                
                                .btn-action:hover {
                                  transform: scale(1.05);
                                }

                                /* Add these styles to ensure nav links have proper contrast */
                                .nav-tabs .nav-fill .nav-item .nav-link,
                                .nav-tabs .nav-link,
                                button.nav-link {
                                  color: #212529 !important;
                                  font-weight: 600 !important;
                                  background-color: #f8f9fa !important;
                                  border: 1px solid #dee2e6 !important;
                                  border-bottom: none !important;
                                  position: relative;
                                }

                                .nav-tabs .nav-link:hover,
                                button.nav-link:hover {
                                  background-color: #e9ecef !important;
                                  color: #000 !important;
                                }

                                .nav-tabs .nav-link.active,
                                button.nav-link.active {
                                  background-color: #fff !important;
                                  color: #1a3a8e !important;
                                  border-bottom-color: transparent !important;
                                  position: relative;
                                  font-weight: 700 !important;
                                }

                                .nav-tabs .nav-link.active::after,
                                button.nav-link.active::after {
                                  content: '';
                                  position: absolute;
                                  bottom: -1px;
                                  left: 0;
                                  right: 0;
                                  height: 3px;
                                  background-color: #1a3a8e;
                                }

                                .nav-tabs .nav-link .fa-users,
                                .nav-tabs .nav-link .fa-project-diagram,
                                button.nav-link i {
                                  color: #1a3a8e;
                                  margin-right: 8px;
                                }

                                .nav-tabs {
                                  border-bottom: 1px solid #dee2e6 !important;
                                }

                                /* Add rounded corners to nav tabs */
                                .nav-tabs .nav-item:first-child .nav-link {
                                  border-top-left-radius: 0.25rem;
                                }

                                .nav-tabs .nav-item:last-child .nav-link {
                                  border-top-right-radius: 0.25rem;
                                }
                              `}
                            </style>

                            {loading ? (
                              <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading projects...</p>
                              </div>
                            ) : team.projects && team.projects.length > 0 ? (
                        <div className="table-responsive">
                                <table className="table table-hover project-table">
                                  <thead className="bg-light">
                                    <tr>
                                      <th style={{width: "40%"}}>Name</th>
                                      <th style={{width: "15%"}}>ID</th>
                                      <th style={{width: "15%"}}>Start Date</th>
                                      <th style={{width: "15%"}}>End Date</th>
                                      <th style={{width: "15%"}} className="text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.projects.map(project => (
                                      <tr key={project.projectIdentifier || project.id}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="project-icon bg-primary text-white rounded d-flex align-items-center justify-content-center mr-3" style={{width: "36px", height: "36px"}}>
                                              <i className="fas fa-project-diagram"></i>
                                            </div>
                                            <div>
                                              <strong>{project.projectName}</strong>
                                              {project.description && (
                                                <div className="small text-muted text-truncate" style={{ maxWidth: "250px" }}>
                                                  {project.description}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <span className="badge badge-pill badge-secondary py-1 px-2">
                                            {project.projectIdentifier}
                                          </span>
                                        </td>
                                        <td>{project.start_date || "Not set"}</td>
                                        <td>{project.end_date || "Not set"}</td>
                                        <td className="text-center">
                                          <div className="d-flex justify-content-around">
                                      <Link
                                        to={`/projectBoard/${project.projectIdentifier}`}
                                              className="btn btn-outline-info mx-1 btn-action"
                                              title="View Project Board"
                                              style={{ minWidth: '40px' }}
                                      >
                                        <i className="fas fa-clipboard-list"></i>
                                      </Link>
                                      <button
                                              className="btn btn-outline-danger mx-1 btn-action"
                                              onClick={(event) => this.handleProjectRemove(project, event)}
                                              title="Remove Project from Team"
                                              type="button"
                                              style={{ cursor: 'pointer', minWidth: '40px' }}
                                              data-project-id={project.projectIdentifier}
                                            >
                                              <i className="fas fa-trash-alt"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                              <div className="text-center py-5 bg-light rounded">
                                <div className="empty-state mb-4">
                                  <i className="fas fa-project-diagram fa-4x text-muted mb-3"></i>
                                  <h5 className="font-weight-bold">No Projects Yet</h5>
                                  <p className="text-muted">
                                    This team doesn't have any projects assigned yet. <br />
                                    Use the form above to add projects to this team.
                                  </p>
                                  <button 
                                    className="btn btn-primary mt-2"
                                    onClick={() => document.getElementById('selectedProjectId').focus()}
                                  >
                                    <i className="fas fa-plus-circle mr-1"></i> Add First Project
                                  </button>
                                </div>
                        </div>
                      )}
                    </div>
                  </div>
                      </div>
                    </div>
                    
                    {/* Project Removal Cards Section */}
                    {team.projects && team.projects.length > 0 && (
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div className="card shadow-sm border-0">
                            <div className="card-header bg-light">
                              <h5 className="mb-0 font-weight-bold text-danger">
                                <i className="fas fa-trash-alt mr-2"></i>
                                Remove Projects
                              </h5>
                            </div>
                            <div className="card-body">
                              <p className="text-muted mb-3">
                                <i className="fas fa-info-circle mr-2"></i>
                                Select projects to remove from this team. This action cannot be undone.
                              </p>
                              <div className="row">
                                {team.projects.map(project => (
                                  <div className="col-lg-4 col-md-6 mb-3" key={`delete-${project.projectIdentifier || project.id}`}>
                                    <div className="card project-card border-0 shadow-sm">
                                      <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                          <h6 className="font-weight-bold mb-0">
                                            {project.projectName}
                                          </h6>
                                          <span className="badge badge-pill badge-secondary">{project.projectIdentifier}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                          <Link
                                            to={`/projectBoard/${project.projectIdentifier}`}
                                            className="btn btn-sm btn-outline-info"
                                          >
                                            <i className="fas fa-clipboard-list mr-1"></i> View Board
                                          </Link>
                                          <button
                                            className="btn btn-sm btn-danger btn-action shadow-sm"
                                            onClick={(event) => this.handleProjectRemove(project, event)}
                                            title="Remove Project from Team"
                                            type="button"
                                            style={{ minWidth: '110px' }}
                                            data-testid={`remove-project-${project.projectIdentifier}`}
                                          >
                                            <i className="fas fa-trash-alt mr-1"></i> Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TeamManage.propTypes = {
  getTeam: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  addTeamMember: PropTypes.func.isRequired,
  addProjectToTeam: PropTypes.func.isRequired,
  removeProjectFromTeam: PropTypes.func.isRequired,
  removeTeamMember: PropTypes.func.isRequired,
  changeTeamMemberRole: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  team: state.team,
  project: state.project,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTeam, getProjects, addTeamMember, addProjectToTeam, removeProjectFromTeam, removeTeamMember, changeTeamMemberRole, getUsers }
)(TeamManage); 