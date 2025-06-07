import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTeam } from "../../actions/teamActions";

class TeamDetails extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getTeam(id, this.props.history)
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    const { team } = this.props.team;
    const { loading } = this.state;

    if (loading || !team) {
      return (
        <div className="loading-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <h5 className="text-muted">Loading team details...</h5>
          </div>
        </div>
      );
    }

    // Format dates for better display
    const createdDate = team.createdAt ? new Date(team.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : "N/A";
    
    const updatedDate = team.updatedAt ? new Date(team.updatedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : "N/A";
    
    // Calculate stats
    const memberCount = team.members ? team.members.length : 0;
    const projectCount = team.projects ? team.projects.length : 0;

    return (
      <div className="team-details py-5 bg-light">
        <div className="container">
          <Link to="/teams" className="btn btn-outline-secondary mb-4 shadow-sm">
            <i className="fas fa-arrow-left mr-2"></i> Back to Teams
          </Link>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow border-0 rounded">
                <div className="card-header bg-gradient-primary text-white py-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="team-icon bg-white rounded-circle d-flex align-items-center justify-content-center mr-3 shadow-sm"
                         style={{ width: "50px", height: "50px" }}>
                      <i className="fas fa-users fa-lg" style={{ color: "#4e73df" }}></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-0 font-weight-bold">{team.name}</h1>
                      <p className="mb-0 opacity-75">{team.teamIdentifier}</p>
                    </div>
                  </div>
                  <div className="team-actions">
                    <Link to={`/teamManage/${team.id}`} className="btn btn-light mr-2 shadow-sm">
                      <i className="fas fa-cog mr-1"></i> Manage Team
                    </Link>
                    <Link to={`/updateTeam/${team.id}`} className="btn btn-warning shadow-sm">
                      <i className="fas fa-edit mr-1"></i> Edit
                    </Link>
                  </div>
                </div>
                
                <div className="card-body py-4">
                  <div className="row mb-4">
                    <div className="col-md-8">
                      <h4 className="mb-3 border-bottom pb-2 font-weight-bold">
                        <i className="fas fa-info-circle text-primary mr-2"></i>
                        About the Team
                      </h4>
                      <p className="lead">{team.description || "No description provided."}</p>
                      
                      <div className="team-meta mt-4">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="meta-item">
                              <div className="meta-label text-muted mb-1">
                                <i className="far fa-calendar-alt mr-1"></i> Created On
                              </div>
                              <div className="meta-value font-weight-bold">{createdDate}</div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="meta-item">
                              <div className="meta-label text-muted mb-1">
                                <i className="fas fa-user-shield mr-1"></i> Team Owner
                              </div>
                              <div className="meta-value font-weight-bold">
                                {team.members && team.members.find(m => m.role === "OWNER") 
                                  ? team.members.find(m => m.role === "OWNER").fullName 
                                  : "Unknown"}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="meta-item">
                              <div className="meta-label text-muted mb-1">
                                <i className="far fa-clock mr-1"></i> Last Updated
                              </div>
                              <div className="meta-value font-weight-bold">{updatedDate}</div>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="meta-item">
                              <div className="meta-label text-muted mb-1">
                                <i className="fas fa-fingerprint mr-1"></i> Team ID
                              </div>
                              <div className="meta-value font-weight-bold">{team.id}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="team-stats">
                        <div className="stat-card mb-4 bg-gradient-primary text-white rounded shadow-sm p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0 opacity-75">Team Members</h6>
                              <h2 className="mb-0 font-weight-bold">{memberCount}</h2>
                            </div>
                            <div className="stat-icon bg-white text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                                 style={{ width: "60px", height: "60px" }}>
                              <i className="fas fa-users fa-2x"></i>
                            </div>
                          </div>
                        </div>
                        
                        <div className="stat-card mb-4 bg-gradient-success text-white rounded shadow-sm p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0 opacity-75">Projects</h6>
                              <h2 className="mb-0 font-weight-bold">{projectCount}</h2>
                            </div>
                            <div className="stat-icon bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                                 style={{ width: "60px", height: "60px" }}>
                              <i className="fas fa-project-diagram fa-2x"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Members Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card shadow border-0 rounded">
                <div className="card-header bg-light py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 font-weight-bold">
                    <i className="fas fa-users text-primary mr-2"></i>
                    Team Members
                  </h5>
                  <Link to={`/teamManage/${team.id}`} className="btn btn-sm btn-primary">
                    <i className="fas fa-user-plus mr-1"></i> Manage Members
                  </Link>
                </div>
                <div className="card-body">
                  {team.members && team.members.length > 0 ? (
                    <div className="row">
                      {team.members.map(member => (
                        <div className="col-lg-4 col-md-6 mb-3" key={member.id || member.username}>
                          <div className="member-card card border-0 shadow-sm hover-card">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <div className="member-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mr-3" 
                                     style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                                  {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <h6 className="mb-0 font-weight-bold">{member.fullName}</h6>
                                  <small className="text-muted">{member.username}</small>
                                </div>
                              </div>
                              <div className="role-badge mb-1">
                                <span className={`badge badge-pill badge-${
                                  member.role === "OWNER" ? "primary" : 
                                  member.role === "TEAM_LEAD" ? "danger" : 
                                  member.role === "PROJECT_MANAGER" ? "warning" : "info"
                                } py-1 px-3`}>
                                  {member.role}
                                </span>
                              </div>
                              <small className="text-muted d-block mt-2">
                                <i className="far fa-calendar-alt mr-1"></i> Joined: {member.joinedAt}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle mr-2"></i>
                      No team members found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Projects Section */}
          <div className="row">
            <div className="col-md-12">
              <div className="card shadow border-0 rounded">
                <div className="card-header bg-light py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 font-weight-bold">
                    <i className="fas fa-project-diagram text-primary mr-2"></i>
                    Team Projects
                  </h5>
                  <Link to={`/teamManage/${team.id}`} className="btn btn-sm btn-success">
                    <i className="fas fa-plus-circle mr-1"></i> Manage Projects
                  </Link>
                </div>
                <div className="card-body">
                  {team.projects && team.projects.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="bg-light">
                          <tr>
                            <th style={{width: "40%"}}>Project Name</th>
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
                                  <div className="project-icon bg-primary text-white rounded d-flex align-items-center justify-content-center mr-3" 
                                       style={{width: "36px", height: "36px"}}>
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
                                <Link
                                  to={`/projectBoard/${project.projectIdentifier}`}
                                  className="btn btn-sm btn-outline-primary"
                                  title="View Project Board"
                                >
                                  <i className="fas fa-clipboard-list mr-1"></i> Board
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle mr-2"></i>
                      No projects assigned to this team yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .team-details {
            min-height: 100vh;
          }
          
          .bg-gradient-primary {
            background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
          }
          
          .bg-gradient-success {
            background: linear-gradient(135deg, #1cc88a 0%, #13855c 100%);
          }
          
          .hover-card {
            transition: all 0.3s ease;
          }
          
          .hover-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
          }
          
          .opacity-75 {
            opacity: 0.75;
          }
          
          .meta-item {
            transition: all 0.2s ease;
            padding: 0.75rem;
            border-radius: 0.25rem;
          }
          
          .meta-item:hover {
            background-color: rgba(0,0,0,0.05);
          }
        `}</style>
      </div>
    );
  }
}

TeamDetails.propTypes = {
  getTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  team: state.team
});

export default connect(mapStateToProps, { getTeam })(TeamDetails); 