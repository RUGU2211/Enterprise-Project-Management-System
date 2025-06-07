import React, { Component } from "react";
import { Link } from "react-router-dom";
import Backlog from "./Backlog";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getBacklog } from "../../actions/backlogActions";
import { getProject } from "../../actions/projectActions";
import AddUserToProject from "../Project/AddUserToProject";

class ProjectBoard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      isLoading: true
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBacklog(id);
    this.props.getProject(id);
    
    // Set a small delay to show loading state
    setTimeout(() => this.setState({ isLoading: false }), 500);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  getErrorContent = () => {
    const { errors } = this.state;
    const { id } = this.props.match.params;
    
    if (errors.projectNotFound) {
      return (
        <div className="alert alert-danger text-center">
          <h5 className="mb-1">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Project Not Found
          </h5>
          <p className="mb-3">{errors.projectNotFound}</p>
          <Link to="/dashboard" className="btn btn-light">
            <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
          </Link>
        </div>
      );
    } else if (errors.projectIdentifier) {
      return (
        <div className="alert alert-danger text-center">
          <h5 className="mb-1">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Project Board Access Error
          </h5>
          <p className="mb-3">{errors.projectIdentifier}</p>
          <Link to="/dashboard" className="btn btn-light">
            <i className="fas fa-arrow-left mr-1"></i> Back to Dashboard
          </Link>
        </div>
      );
    } else {
      return (
        <div className="alert alert-info text-center">
          <h5 className="mb-1">
            <i className="fas fa-info-circle mr-2"></i>
            No Project Tasks Found
          </h5>
          <p className="mb-3">Create a project task to get started</p>
          <Link 
            to={`/addProjectTask/${id}`} 
            className="btn btn-primary"
          >
            <i className="fas fa-plus-circle mr-1"></i> Create Project Task
          </Link>
        </div>
      );
    }
  };

  render() {
    const { id } = this.props.match.params;
    const { project_tasks } = this.props.backlog;
    const { project } = this.props.project;
    const { errors, isLoading } = this.state;
    
    let BoardContent;
    
    const hasErrors = errors.projectNotFound || errors.projectIdentifier;
    const noTasks = project_tasks.length === 0;
    
    if (isLoading) {
      BoardContent = (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="mt-2 text-primary">Loading Project Board...</div>
        </div>
      );
    } else if (hasErrors || noTasks) {
      BoardContent = this.getErrorContent();
    } else {
      BoardContent = <Backlog project_tasks_prop={project_tasks} />;
    }

    return (
      <div className="project-board-wrapper py-4 project-board-page">
        <div className="container">
          {/* Background Pattern */}
          <div className="project-board-background"></div>
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb bg-light shadow-sm border-0">
              <li className="breadcrumb-item">
                <Link to="/dashboard"><i className="fas fa-home"></i> Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <i className="fas fa-clipboard-list"></i> Project Board {project && `- ${project.projectName}`}
              </li>
            </ol>
          </nav>
          
          {/* Board Header */}
          <div className="row mb-4">
            <div className="col-md-9">
              <div className="d-flex align-items-center mb-3">
                <Link to="/dashboard" className="btn btn-sm btn-outline-primary rounded-circle mr-3">
                  <i className="fas fa-arrow-left"></i>
                </Link>
                <h1 className="project-board-title h3 mb-0 text-primary font-weight-bold">
                  {project ? project.projectName : "Project"} Board
                </h1>
              </div>
              {project && project.description && (
                <p className="text-muted">{project.description}</p>
              )}
            </div>
            
            <div className="col-md-3 text-md-right mt-3 mt-md-0">
              <div className="d-flex justify-content-end">
                <Link 
                  to={`/addProjectTask/${id}`} 
                  className="btn btn-primary btn-icon shadow-sm mr-2"
                >
                  <i className="fas fa-plus-circle mr-1"></i> Create Task
                </Link>
                <AddUserToProject projectId={id} />
              </div>
            </div>
          </div>
          
          {/* Project Details */}
          {project && !hasErrors && (
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="project-info-box">
                          <div className="text-muted small font-weight-bold mb-1">
                            <i className="fas fa-user-tie mr-1 text-primary"></i> PROJECT LEAD
                          </div>
                          <div className="text-dark">
                            {project.projectLeader || 'Not assigned'}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="project-info-box">
                          <div className="text-muted small font-weight-bold mb-1">
                            <i className="fas fa-calendar-alt mr-1 text-primary"></i> START DATE
                          </div>
                          <div className="text-dark">
                            {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="project-info-box">
                          <div className="text-muted small font-weight-bold mb-1">
                            <i className="fas fa-calendar-check mr-1 text-primary"></i> END DATE
                          </div>
                          <div className="text-dark">
                            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="project-info-box">
                          <div className="text-muted small font-weight-bold mb-1">
                            <i className="fas fa-tasks mr-1 text-primary"></i> TOTAL TASKS
                          </div>
                          <div className="text-dark">
                            {project_tasks.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Board Content */}
          {BoardContent}
        </div>
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  backlog: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  getBacklog: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  backlog: state.backlog,
  project: state.project,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBacklog, getProject }
)(ProjectBoard);
