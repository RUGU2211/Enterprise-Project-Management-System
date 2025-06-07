import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTeam, deleteTeam } from "../../actions/teamActions";

class TeamBoard extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getTeam(id, this.props.history);
  }

  onDeleteClick = id => {
    this.props.deleteTeam(id);
    this.props.history.push("/teams");
  };

  render() {
    const { team } = this.props;

    if (!team || !team.id) {
      return (
        <div className="container">
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading team details...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="team-board">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <Link to="/teams" className="btn btn-light">
                  <i className="fas fa-arrow-left mr-1"></i> Back to Teams
                </Link>
                <div>
                  <Link to={`/updateTeam/${team.id}`} className="btn btn-primary mr-2">
                    <i className="fas fa-edit mr-1"></i> Edit Team
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => this.onDeleteClick(team.id)}
                  >
                    <i className="fas fa-trash-alt mr-1"></i> Delete Team
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="team-header card shadow-sm" style={{ borderTop: `4px solid ${team.teamColor || "#3f51b5"}` }}>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      <div 
                        className="team-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-2" 
                        style={{ 
                          backgroundColor: team.teamColor || "#3f51b5", 
                          width: "80px", 
                          height: "80px" 
                        }}
                      >
                        <i className={`fas fa-${team.teamIcon || "users"} fa-2x text-white`}></i>
                      </div>
                    </div>
                    <div className="col-md-10">
                      <h1 className="mb-1">{team.name}</h1>
                      <p className="text-muted mb-3">
                        <span className="mr-3">
                          <i className="fas fa-calendar-alt mr-1"></i> Created {new Date(team.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          <i className="fas fa-user-tie mr-1"></i> Team Lead: {team.teamLead ? team.teamLead.fullName : "Not assigned"}
                        </span>
                      </p>
                      <p className="lead mb-0">{team.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <i className="fas fa-users mr-2" style={{ color: team.teamColor || "#3f51b5" }}></i>
                    Team Members
                  </h4>
                </div>
                <div className="card-body p-0">
                  {team.members && team.members.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Team Lead Row */}
                          {team.teamLead && (
                            <tr>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar bg-primary text-white rounded-circle mr-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                                    <i className="fas fa-user-tie"></i>
                                  </div>
                                  <div>{team.teamLead.fullName}</div>
                                </div>
                              </td>
                              <td><span className="badge badge-primary">Team Lead</span></td>
                              <td>{team.teamLead.username}</td>
                              <td><span className="badge badge-success">Active</span></td>
                              <td>
                                <button className="btn btn-sm btn-link text-danger" disabled>
                                  <i className="fas fa-user-minus"></i>
                                </button>
                              </td>
                            </tr>
                          )}
                          
                          {/* Team Members */}
                          {team.members && team.members.map(member => (
                            <tr key={member.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar bg-light text-primary rounded-circle mr-2 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", color: team.teamColor || "#3f51b5" }}>
                                    <i className="fas fa-user"></i>
                                  </div>
                                  <div>{member.user ? member.user.fullName : 'Unknown Member'}</div>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-light">{member.role || "Member"}</span>
                              </td>
                              <td>{member.user ? member.user.username : 'Unknown'}</td>
                              <td><span className="badge badge-success">Active</span></td>
                              <td>
                                <button className="btn btn-sm btn-link text-danger">
                                  <i className="fas fa-user-minus"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-muted mb-0">
                        <i className="fas fa-info-circle mr-2"></i>
                        No additional team members yet.
                      </p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white">
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-user-plus mr-1"></i> Add Team Member
                  </button>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <i className="fas fa-clipboard-list mr-2" style={{ color: team.teamColor || "#3f51b5" }}></i>
                    Projects
                  </h4>
                </div>
                <div className="card-body p-0">
                  {team.projects && team.projects.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {team.projects.map(project => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={project.id}>
                          <div>
                            <strong>{project.name}</strong>
                            <div className="small text-muted">{project.description}</div>
                          </div>
                          <Link to={`/project/${project.id}`} className="btn btn-sm btn-light">
                            <i className="fas fa-eye"></i>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-muted mb-0">
                        <i className="fas fa-info-circle mr-2"></i>
                        No projects assigned to this team yet.
                      </p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-white">
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-plus-circle mr-1"></i> Assign Project
                  </button>
                </div>
              </div>
              
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h4 className="mb-0">
                    <i className="fas fa-chart-pie mr-2" style={{ color: team.teamColor || "#3f51b5" }}></i>
                    Team Stats
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6 mb-3">
                      <div className="h2 font-weight-bold" style={{ color: team.teamColor || "#3f51b5" }}>
                        {team.members ? team.members.length + 1 : 1}
                      </div>
                      <div className="text-muted">Members</div>
                    </div>
                    <div className="col-6 mb-3">
                      <div className="h2 font-weight-bold" style={{ color: team.teamColor || "#3f51b5" }}>
                        {team.projects ? team.projects.length : 0}
                      </div>
                      <div className="text-muted">Projects</div>
                    </div>
                    <div className="col-6">
                      <div className="h2 font-weight-bold" style={{ color: team.teamColor || "#3f51b5" }}>
                        {team.tasks ? team.tasks.length : 0}
                      </div>
                      <div className="text-muted">Tasks</div>
                    </div>
                    <div className="col-6">
                      <div className="h2 font-weight-bold" style={{ color: team.teamColor || "#3f51b5" }}>
                        {team.completedTasks ? team.completedTasks : 0}
                      </div>
                      <div className="text-muted">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TeamBoard.propTypes = {
  getTeam: PropTypes.func.isRequired,
  deleteTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  team: state.team.team
});

export default connect(
  mapStateToProps,
  { getTeam, deleteTeam }
)(TeamBoard); 