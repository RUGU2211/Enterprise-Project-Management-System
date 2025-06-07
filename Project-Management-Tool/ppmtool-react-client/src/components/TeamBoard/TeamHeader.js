import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTeam } from "../../actions/teamActions";

class TeamHeader extends Component {
  componentDidMount() {
    const { teamId } = this.props;
    this.props.getTeam(teamId);
  }

  render() {
    const { team } = this.props.team;
    
    if (!team) {
      return (
        <div className="alert alert-info text-center my-4">
          <i className="fas fa-spinner fa-spin mr-2"></i> Loading team information...
        </div>
      );
    }
    
    const memberCount = team.members ? team.members.length : 0;
    const projectCount = team.projects ? team.projects.length : 0;
    
    return (
      <div className="team-header mb-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-light shadow-sm border-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/teams"><i className="fas fa-users"></i> Teams</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <i className="fas fa-user-friends"></i> {team.name}
            </li>
          </ol>
        </nav>

        {/* Team Header Card */}
        <div className="card team-header-card shadow-sm border-0 mb-4">
          <div className="card-body pb-0">
            <div className="row align-items-center">
              <div className="col-md-8 mb-4 mb-md-0">
                <div className="d-flex align-items-center mb-3">
                  <Link to="/teams" className="btn btn-sm btn-outline-primary rounded-circle mr-3">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <h1 className="text-primary mb-0 team-name font-weight-bold">
                    {team.name}
                  </h1>
                </div>
                
                <p className="team-description text-muted">
                  {team.description || "No team description provided."}
                </p>
                
                <div className="team-leader mb-3">
                  <div className="text-muted small font-weight-bold mb-1">
                    TEAM LEADER
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar bg-primary text-white mr-2">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="font-weight-bold">{team.teamLeader || "Not assigned"}</div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="stat-card bg-primary-soft border-0 h-100 p-3 rounded">
                      <div className="text-primary small text-uppercase font-weight-bold mb-1">
                        Members
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="h2 mb-0 mr-2 font-weight-bold text-primary">{memberCount}</div>
                        <i className="fas fa-users text-primary"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6 mb-3">
                    <div className="stat-card bg-success-soft border-0 h-100 p-3 rounded">
                      <div className="text-success small text-uppercase font-weight-bold mb-1">
                        Projects
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="h2 mb-0 mr-2 font-weight-bold text-success">{projectCount}</div>
                        <i className="fas fa-clipboard-list text-success"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="team-actions mb-3">
                  <Link 
                    to={`/updateTeam/${team.id}`}
                    className="btn btn-outline-primary btn-block mb-2"
                  >
                    <i className="fas fa-edit mr-1"></i> Edit Team
                  </Link>
                  
                  <Link 
                    to={`/addProject/${team.id}`}
                    className="btn btn-outline-secondary btn-block"
                  >
                    <i className="fas fa-plus-circle mr-1"></i> Assign Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-footer bg-white border-top-0 pt-0">
            <ul className="nav nav-tabs card-header-tabs nav-fill">
              <li className="nav-item">
                <Link 
                  to={`/teamBoard/${team.id}`} 
                  className="nav-link active"
                >
                  <i className="fas fa-users mr-1"></i> Team Board
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to={`/teamProjects/${team.id}`} 
                  className="nav-link"
                >
                  <i className="fas fa-clipboard-list mr-1"></i> Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to={`/teamPerformance/${team.id}`} 
                  className="nav-link"
                >
                  <i className="fas fa-chart-line mr-1"></i> Performance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

TeamHeader.propTypes = {
  getTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  teamId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  team: state.team
});

export default connect(mapStateToProps, { getTeam })(TeamHeader); 