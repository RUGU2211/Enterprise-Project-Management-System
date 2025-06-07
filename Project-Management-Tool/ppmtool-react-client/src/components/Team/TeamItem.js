import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTeam } from "../../actions/teamActions";

class TeamItem extends Component {
  onDeleteClick = id => {
    this.props.deleteTeam(id);
  };

  render() {
    const { team } = this.props;
    return (
      <div className="team-card card shadow-lg border-0 mb-4 position-relative overflow-hidden hover-card">
        <div className="card-header p-4 d-flex align-items-center" 
             style={{
               background: `linear-gradient(135deg, ${team.teamColor || "#4e73df"} 0%, ${team.teamColor ? team.teamColor + "cc" : "#224abe"} 100%)`,
               borderBottom: "3px solid rgba(255,255,255,0.2)"
             }}>
          <div className="team-icon bg-white rounded-circle d-flex align-items-center justify-content-center mr-3 shadow" 
               style={{ width: "60px", height: "60px", minWidth: "60px" }}>
            <i className={`fas fa-${team.teamIcon || "users"} fa-2x`} 
               style={{ color: team.teamColor || "#4e73df" }}></i>
          </div>
          <div className="text-white flex-grow-1">
            <h3 className="mb-1 font-weight-bold">{team.name}</h3>
            <p className="mb-0">
              <span className="badge badge-light shadow-sm mr-2">
                <i className="far fa-calendar-alt mr-1"></i>
                {new Date(team.createdAt).toLocaleDateString()}
              </span>
              <span className="badge badge-light shadow-sm">
                <i className="fas fa-users mr-1"></i>
                {team.memberCount || 1} members
              </span>
            </p>
          </div>
        </div>
        
        <div className="card-body p-4">
          <p className="team-description mb-4">
            {team.description || "No description available for this team."}
          </p>
          
          <div className="team-stats d-flex flex-wrap mb-4">
            <div className="stat-item bg-primary-light mr-3 mb-2 px-3 py-2 rounded shadow">
              <div className="d-flex align-items-center">
                <i className="fas fa-user-tie mr-2 text-primary"></i>
                <div>
                  <div className="stat-label small text-muted">Team Lead</div>
                  <div className="stat-value font-weight-bold">{team.teamLeadName || "Not assigned"}</div>
                </div>
              </div>
            </div>
            <div className="stat-item bg-success-light mr-3 mb-2 px-3 py-2 rounded shadow">
              <div className="d-flex align-items-center">
                <i className="fas fa-project-diagram mr-2 text-success"></i>
                <div>
                  <div className="stat-label small text-muted">Projects</div>
                  <div className="stat-value font-weight-bold">{team.projectCount || 0}</div>
                </div>
              </div>
            </div>
            <div className="stat-item bg-info-light mb-2 px-3 py-2 rounded shadow">
              <div className="d-flex align-items-center">
                <i className="fas fa-tasks mr-2 text-info"></i>
                <div>
                  <div className="stat-label small text-muted">Tasks</div>
                  <div className="stat-value font-weight-bold">{team.taskCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer bg-white border-0 p-4 d-flex justify-content-between">
          <div>
            <Link to={`/teamBoard/${team.id}`} className="btn btn-primary mr-2 shadow">
              <i className="fas fa-clipboard-list mr-1"></i> Team Board
            </Link>
            <Link to={`/updateTeam/${team.id}`} className="btn btn-light mr-2 shadow">
              <i className="fas fa-pencil-alt mr-1"></i> Edit
            </Link>
          </div>
          <button 
            className="btn btn-danger shadow"
            onClick={this.onDeleteClick.bind(this, team.id)}
          >
            <i className="fas fa-trash-alt mr-1"></i> Delete
          </button>
        </div>
        
        <div className="card-decorations">
          <div className="card-decoration-1"></div>
          <div className="card-decoration-2"></div>
        </div>
        
        <style jsx>{`
          .team-card {
            border-radius: 12px;
            transition: all 0.3s ease;
            overflow: hidden;
          }
          
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
          }
          
          .team-icon {
            transition: all 0.3s ease;
            z-index: 1;
          }
          
          .team-card:hover .team-icon {
            transform: scale(1.1) rotate(10deg);
          }
          
          .team-description {
            font-size: 1rem;
            color: #495057;
            line-height: 1.6;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
            border: none;
            transition: all 0.3s ease;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(78, 115, 223, 0.4) !important;
          }
          
          .btn-danger {
            background: linear-gradient(135deg, #e74a3b 0%, #be2617 100%);
            border: none;
            transition: all 0.3s ease;
          }
          
          .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(231, 74, 59, 0.4) !important;
          }
          
          .btn-light {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: none;
            color: #5a5c69;
            transition: all 0.3s ease;
          }
          
          .btn-light:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
            color: #2e59d9;
          }
          
          .stat-item {
            transition: all 0.3s ease;
            min-width: 150px;
          }
          
          .stat-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
          }
          
          .bg-primary-light {
            background-color: rgba(78, 115, 223, 0.1);
          }
          
          .bg-success-light {
            background-color: rgba(40, 167, 69, 0.1);
          }
          
          .bg-info-light {
            background-color: rgba(54, 185, 204, 0.1);
          }
          
          .card-decorations {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
          }
          
          .card-decoration-1 {
            position: absolute;
            top: -20%;
            right: -20%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
          }
          
          .card-decoration-2 {
            position: absolute;
            bottom: -20%;
            left: -20%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(78,115,223,0.05) 0%, rgba(78,115,223,0) 70%);
            border-radius: 50%;
          }
        `}</style>
      </div>
    );
  }
}

TeamItem.propTypes = {
  deleteTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired
};

export default connect(
  null,
  { deleteTeam }
)(TeamItem); 