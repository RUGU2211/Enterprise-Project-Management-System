import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTeam } from "../../actions/teamActions";

class TeamItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeleteConfirmation: false,
      isHovered: false
    };
  }

  onDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(this.props.team);
    } else {
      // Fallback to local delete confirmation
      if (this.state.showDeleteConfirmation) {
        this.props.deleteTeam(this.props.team.id, this.props.history);
        this.setState({ showDeleteConfirmation: false });
      } else {
        this.setState({ showDeleteConfirmation: true });
      }
    }
  };
  
  cancelDelete = () => {
    this.setState({ showDeleteConfirmation: false });
  };

  setHovered = (isHovered) => {
    this.setState({ isHovered });
  }

  formatDate = date => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  render() {
    const { team } = this.props;
    const { showDeleteConfirmation } = this.state;
    const isActive = team.active !== false;
    const topBorderStyle = isActive ? { borderTop: '4px solid #28a745' } : { borderTop: '4px solid #6c757d' };
    
    return (
      <div 
        className="card mb-3 shadow-sm border-0 team-item"
        style={Object.assign({}, topBorderStyle, { background: 'var(--color-card-bg)', color: 'var(--color-text)' })}
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
      >
        <div className="card-body p-4">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <h5 className="mb-0 font-weight-bold text-dark mr-3" style={{ color: 'var(--color-text)' }}>{team.teamName}</h5>
                <span className="badge badge-light border text-primary mr-2" style={{ background: 'var(--color-card-alt)', color: 'var(--color-accent)' }}>
                  <i className="fas fa-hashtag mr-1"></i>{team.teamIdentifier}
                </span>
                <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'} text-white`}>
                  <i className="fas fa-circle mr-1 small"></i>{isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-muted mb-0" style={{ color: 'var(--color-text-light)' }}>{team.description || "No description provided"}</p>
            </div>
          </div>

          {/* Team Details */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="bg-primary-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-user-tie text-primary"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">TEAM LEADER</div>
                  <div className="text-muted">{team.teamLeader || 'Not assigned'}</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="bg-info-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-users text-info"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">MEMBERS</div>
                  <div className="text-muted">{team.memberCount || 0} members</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-success-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-calendar-alt text-success"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">CREATED</div>
                  <div className="text-muted">{this.formatDate(team.created_At)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row">
            <div className="col-md-4 mb-2 mb-md-0">
              <Link
                to={`/teamBoard/${team.teamIdentifier}`}
                className="btn btn-primary btn-block"
              >
                <i className="fas fa-clipboard-list mr-2"></i> View Board
              </Link>
            </div>
            <div className="col-md-4 mb-2 mb-md-0">
              <Link
                to={`/updateTeam/${team.teamIdentifier}`}
                className="btn btn-outline-secondary btn-block"
              >
                <i className="fas fa-edit mr-2"></i> Edit
              </Link>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-danger btn-block"
                onClick={this.onDeleteClick}
              >
                <i className="fas fa-trash-alt mr-2"></i> Delete
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirmation && (
            <div className="alert alert-danger mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Are you sure you want to delete this team?
                </div>
                <div>
                  <button 
                    className="btn btn-sm btn-danger mr-2" 
                    onClick={this.onDeleteClick}
                  >
                    Yes, Delete
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={this.cancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TeamItem.propTypes = {
  team: PropTypes.object.isRequired,
  deleteTeam: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(
  mapStateToProps,
  { deleteTeam }
)(TeamItem); 