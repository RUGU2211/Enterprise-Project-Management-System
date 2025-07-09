import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteProject } from "../../actions/projectActions";

class ProjectItem extends Component {
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
      this.props.onDeleteClick(this.props.project);
    } else {
      // Fallback to local delete confirmation
      if (this.state.showDeleteConfirmation) {
        this.props.deleteProject(this.props.project.projectIdentifier, this.props.history);
        this.setState({ showDeleteConfirmation: false });
      } else {
        this.setState({ showDeleteConfirmation: true });
      }
    }
  };
  
  cancelDelete = () => {
    this.setState({ showDeleteConfirmation: false });
  };

  onBoardClick = (project) => {
    // Store project ID in localStorage for navigation backup
    localStorage.setItem("lastAccessedProjectBoard", project.projectIdentifier);
    
    // Store minimal project info for display in case of API failure
    try {
      const projectBasicInfo = {
        projectIdentifier: project.projectIdentifier,
        projectName: project.projectName,
        description: project.description
      };
      localStorage.setItem(`project_${project.projectIdentifier}`, JSON.stringify(projectBasicInfo));
    } catch (err) {
      console.error("Error storing project info in localStorage:", err);
    }
  };

  setHovered = (isHovered) => {
    this.setState({ isHovered });
  }

  getStatusClass = (startDate, endDate) => {
    const now = new Date();
    
    if (!startDate) return "bg-secondary";
    
    const start = new Date(startDate);
    
    if (start > now) return "bg-info"; // Not started yet
    
    if (endDate) {
      const end = new Date(endDate);
      if (now > end) return "bg-success"; // Completed
    }
    
    return "bg-primary"; // In progress
  };

  getStatusText = (startDate, endDate) => {
    const now = new Date();
    
    if (!startDate) return "Not Scheduled";
    
    const start = new Date(startDate);
    
    if (start > now) return "Not Started";
    
    if (endDate) {
      const end = new Date(endDate);
      if (now > end) return "Completed";
    }
    
    return "In Progress";
  };

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
    const { project } = this.props;
    const { showDeleteConfirmation } = this.state;
    const statusClass = this.getStatusClass(project.start_date, project.end_date);
    const statusText = this.getStatusText(project.start_date, project.end_date);
    // Use project.projectLeadEmail if available, else fallback
    const projectLeadEmail = project.projectLeadEmail || project.email || 'No email provided';
    
    return (
      <div 
        className="card mb-3 shadow-sm border-0 project-item"
        style={{ background: 'var(--color-card-bg)', color: 'var(--color-text)' }}
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
      >
        <div className="card-body p-4">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <h5 className="mb-0 font-weight-bold text-dark mr-3" style={{ color: 'var(--color-text)' }}>{project.projectName}</h5>
                <span className="badge badge-light border text-primary mr-2" style={{ background: 'var(--color-card-alt)', color: 'var(--color-accent)' }}>
                  <i className="fas fa-hashtag mr-1"></i>{project.projectIdentifier}
                </span>
                <span className={`badge ${statusClass} text-white`}>
                  <i className="fas fa-circle mr-1 small"></i>{statusText}
                </span>
              </div>
              <p className="text-muted mb-0" style={{ color: 'var(--color-text-light)' }}>{project.description || "No description provided"}</p>
            </div>
          </div>

          {/* Project Details */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="bg-primary-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-user-tie text-primary"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">PROJECT LEAD</div>
                  <div className="text-muted">{project.projectLeader || 'Not assigned'}</div>
                  <div className="text-muted small">{projectLeadEmail}</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <div className="bg-info-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-calendar-alt text-info"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">START DATE</div>
                  <div className="text-muted">{this.formatDate(project.start_date)}</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-success-soft rounded-circle p-2 mr-3">
                  <i className="fas fa-calendar-check text-success"></i>
                </div>
                <div>
                  <div className="font-weight-bold text-dark small">END DATE</div>
                  <div className="text-muted">{this.formatDate(project.end_date)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row">
            <div className="col-md-4 mb-2 mb-md-0">
              <Link
                to={`/projectBoard/${project.projectIdentifier}`}
                className="btn btn-primary btn-block"
                onClick={() => this.onBoardClick(project)}
              >
                <i className="fas fa-clipboard-list mr-2"></i> View Board
              </Link>
            </div>
            <div className="col-md-4 mb-2 mb-md-0">
              <Link
                to={`/updateProject/${project.projectIdentifier}`}
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
                  Are you sure you want to delete this project?
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

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
  deleteProject: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(
  mapStateToProps,
  { deleteProject }
)(ProjectItem);

