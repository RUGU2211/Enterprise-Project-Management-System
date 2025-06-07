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

  onDeleteClick = id => {
    if (this.state.showDeleteConfirmation) {
      this.props.deleteProject(id, this.props.history);
      if (this.props.setAlert) {
        this.props.setAlert("Project deleted successfully", "success");
      }
      this.setState({ showDeleteConfirmation: false });
    } else {
      this.setState({ showDeleteConfirmation: true });
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
    const { showDeleteConfirmation, isHovered } = this.state;
    
    const statusClass = this.getStatusClass(project.start_date, project.end_date);
    const statusText = this.getStatusText(project.start_date, project.end_date);
    
    return (
      <div 
        className="card dashboard-card mb-4 shadow-sm border-0 h-100"
        onMouseEnter={() => this.setHovered(true)}
        onMouseLeave={() => this.setHovered(false)}
      >
        <div className={`card-status-indicator ${statusClass}`}></div>
        <div className="card-header dashboard-card-header bg-white border-bottom-0 pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="project-title">
              <h5 className="card-title mb-1 text-primary font-weight-bold">
                {project.projectName}
              </h5>
              <div className="mb-2">
                <span className="badge badge-light border text-primary mr-2">
                  <i className="fas fa-hashtag mr-1"></i>{project.projectIdentifier}
                </span>
                <span className={`badge ${statusClass} text-white`}>
                  <i className="fas fa-circle mr-1 small"></i>{statusText}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body pt-2">
          <div className="mb-3">
            <p className="card-text text-muted">
              {project.description || "No description provided"}
            </p>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="project-info-box mb-2">
                <div className="text-muted small font-weight-bold mb-1">
                  <i className="fas fa-user-tie mr-1 text-primary"></i> PROJECT LEAD
                </div>
                <div className="text-dark">
                  {project.projectLeader || 'Not assigned'}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="project-info-box mb-2">
                <div className="text-muted small font-weight-bold mb-1">
                  <i className="fas fa-calendar-alt mr-1 text-primary"></i> START DATE
                </div>
                <div className="text-dark">
                  {this.formatDate(project.start_date)}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="project-info-box mb-2">
                <div className="text-muted small font-weight-bold mb-1">
                  <i className="fas fa-calendar-check mr-1 text-primary"></i> END DATE
                </div>
                <div className="text-dark">
                  {this.formatDate(project.end_date)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="project-actions mt-auto">
            {showDeleteConfirmation ? (
              <div className="alert alert-danger mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Are you sure you want to delete this project?
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-danger mr-2" 
                      onClick={this.onDeleteClick.bind(this, project.projectIdentifier)}
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
            ) : (
              <div className="row">
                <div className="col-md-4 mb-2 mb-md-0">
                  <Link
                    to={`/projectBoard/${project.projectIdentifier}`}
                    className="btn btn-primary btn-block btn-icon rounded-pill"
                    onClick={() => this.onBoardClick(project)}
                  >
                    <i className="fas fa-clipboard-list mr-2"></i> View Board
                  </Link>
                </div>
                <div className="col-md-4 mb-2 mb-md-0">
                  <Link
                    to={`/updateProject/${project.projectIdentifier}`}
                    className="btn btn-outline-secondary btn-block btn-icon rounded-pill"
                  >
                    <i className="fas fa-edit mr-2"></i> Edit
                  </Link>
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-outline-danger btn-block btn-icon rounded-pill"
                    onClick={this.onDeleteClick.bind(this, project.projectIdentifier)}
                  >
                    <i className="fas fa-trash-alt mr-2"></i> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="card-footer bg-light py-2 text-muted small">
          <div className="d-flex justify-content-between">
            <span>
              <i className="fas fa-clock mr-1"></i> 
              Created: {project.created_At ? new Date(project.created_At).toLocaleDateString() : "N/A"}
            </span>
            <span>
              <i className="fas fa-pencil-alt mr-1"></i> 
              Updated: {project.updated_At ? new Date(project.updated_At).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ProjectItem.propTypes = {
  deleteProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  setAlert: PropTypes.func
};

export default connect(
  null,
  { deleteProject }
)(ProjectItem);

