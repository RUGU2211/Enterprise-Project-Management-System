import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getTeam, addTeamMember } from "../../actions/teamActions";
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
      errors: {}
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getTeam(id, this.props.history);
    this.props.getProjects();
    this.setState({ loading: false });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onAddMember = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { newMemberId, newMemberRole } = this.state;
    
    if (!newMemberId) {
      this.setState({ errors: { newMemberId: "Please select a user" } });
      return;
    }
    
    this.props.addTeamMember(id, newMemberId, newMemberRole);
    this.setState({ newMemberId: "", newMemberRole: "MEMBER" });
  };

  onAddProject = e => {
    e.preventDefault();
    const { id } = this.props.match.params;
    const { selectedProjectId } = this.state;
    
    if (!selectedProjectId) {
      this.setState({ errors: { selectedProjectId: "Please select a project" } });
      return;
    }
    
    // Call action to add project to team
    // this.props.addProjectToTeam(id, selectedProjectId);
    alert("Adding project to team - Implementation pending");
    this.setState({ selectedProjectId: "" });
  };

  changeTab = tab => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { team } = this.props.team;
    const { projects } = this.props.project;
    const { errors, activeTab, loading } = this.state;
    
    // Mock data for users
    const users = [
      { id: 1, username: "john_doe", fullName: "John Doe" },
      { id: 2, username: "jane_smith", fullName: "Jane Smith" },
      { id: 3, username: "mike_johnson", fullName: "Mike Johnson" }
    ];

    if (loading || !team) {
      return <div className="text-center">Loading...</div>;
    }

    return (
      <div className="team-manage">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/teams" className="btn btn-light mb-3">
                <i className="fas fa-arrow-left"></i> Back to Teams
              </Link>
              <h1 className="text-center mb-4">
                Manage Team: {team.name}
              </h1>
              
              {/* Tabs Navigation */}
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={classnames("nav-link", {
                      active: activeTab === "members"
                    })}
                    onClick={() => this.changeTab("members")}
                  >
                    <i className="fas fa-users mr-1"></i>
                    Team Members
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classnames("nav-link", {
                      active: activeTab === "projects"
                    })}
                    onClick={() => this.changeTab("projects")}
                  >
                    <i className="fas fa-tasks mr-1"></i>
                    Team Projects
                  </button>
                </li>
              </ul>
              
              {/* Members Tab Content */}
              {activeTab === "members" && (
                <div className="tab-content p-3 border border-top-0 rounded-bottom bg-white">
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <h5>Add Team Member</h5>
                      <form onSubmit={this.onAddMember} className="form-inline">
                        <div className="form-group mr-2 mb-2">
                          <select
                            className={classnames("form-control", {
                              "is-invalid": errors.newMemberId
                            })}
                            name="newMemberId"
                            value={this.state.newMemberId}
                            onChange={this.onChange}
                          >
                            <option value="">Select User</option>
                            {users.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.fullName} ({user.username})
                              </option>
                            ))}
                          </select>
                          {errors.newMemberId && (
                            <div className="invalid-feedback">{errors.newMemberId}</div>
                          )}
                        </div>
                        <div className="form-group mr-2 mb-2">
                          <select
                            className="form-control"
                            name="newMemberRole"
                            value={this.state.newMemberRole}
                            onChange={this.onChange}
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                        <button type="submit" className="btn btn-success mb-2">
                          <i className="fas fa-user-plus mr-1"></i> Add Member
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <h5>Team Members</h5>
                      {team.members && team.members.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.members.map(member => (
                                <tr key={member.id}>
                                  <td>{member.fullName}</td>
                                  <td>{member.username}</td>
                                  <td>
                                    <span className={`badge badge-${
                                      member.role === "OWNER" ? "danger" :
                                      member.role === "ADMIN" ? "warning" : "info"
                                    }`}>
                                      {member.role}
                                    </span>
                                  </td>
                                  <td>{member.joinedAt}</td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => alert(`Remove ${member.username} from team - Implementation pending`)}
                                    >
                                      <i className="fas fa-user-minus"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          No team members found. Add members using the form above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Projects Tab Content */}
              {activeTab === "projects" && (
                <div className="tab-content p-3 border border-top-0 rounded-bottom bg-white">
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <h5>Add Project to Team</h5>
                      <form onSubmit={this.onAddProject} className="form-inline">
                        <div className="form-group mr-2 mb-2">
                          <select
                            className={classnames("form-control", {
                              "is-invalid": errors.selectedProjectId
                            })}
                            name="selectedProjectId"
                            value={this.state.selectedProjectId}
                            onChange={this.onChange}
                          >
                            <option value="">Select Project</option>
                            {projects.map(project => (
                              <option key={project.id} value={project.id}>
                                {project.projectName} ({project.projectIdentifier})
                              </option>
                            ))}
                          </select>
                          {errors.selectedProjectId && (
                            <div className="invalid-feedback">{errors.selectedProjectId}</div>
                          )}
                        </div>
                        <button type="submit" className="btn btn-success mb-2">
                          <i className="fas fa-plus-circle mr-1"></i> Add Project
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <h5>Team Projects</h5>
                      {team.projects && team.projects.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.projects.map(project => (
                                <tr key={project.id}>
                                  <td>{project.projectName}</td>
                                  <td>{project.projectIdentifier}</td>
                                  <td>{project.start_date}</td>
                                  <td>{project.end_date}</td>
                                  <td>
                                    <div className="btn-group">
                                      <Link
                                        to={`/projectBoard/${project.projectIdentifier}`}
                                        className="btn btn-info btn-sm"
                                      >
                                        <i className="fas fa-clipboard-list"></i>
                                      </Link>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => alert(`Remove project from team - Implementation pending`)}
                                      >
                                        <i className="fas fa-times"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          No projects assigned to this team. Add a project using the form above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
  team: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  team: state.team,
  project: state.project,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getTeam, getProjects, addTeamMember }
)(TeamManage); 