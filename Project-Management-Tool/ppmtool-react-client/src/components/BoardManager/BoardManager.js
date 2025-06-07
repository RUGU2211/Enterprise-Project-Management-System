import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProjects } from "../../actions/projectActions";

class BoardManager extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      searchTerm: "",
      filterStatus: "all"
    };
  }

  componentDidMount() {
    this.props.getProjects();
    this.setState({ loading: false });
  }

  handleSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };

  handleFilterChange = e => {
    this.setState({ filterStatus: e.target.value });
  };

  render() {
    const { projects } = this.props.project;
    const { loading, searchTerm, filterStatus } = this.state;

    // Filter projects based on search term and status filter
    const filteredProjects = projects.filter(project => {
      const matchesSearch = 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterStatus === "all") {
        return matchesSearch;
      }
      
      // Simple status determination logic - can be expanded
      let status = "not_started";
      const now = new Date();
      const startDate = project.start_date ? new Date(project.start_date) : null;
      const endDate = project.end_date ? new Date(project.end_date) : null;
      
      if (endDate && now > endDate) {
        status = "completed";
      } else if (startDate && now >= startDate) {
        status = "in_progress";
      }
      
      return matchesSearch && status === filterStatus;
    });

    if (loading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading boards...</p>
        </div>
      );
    }

    return (
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mt-4 mb-4">
          <ol className="breadcrumb bg-light shadow-sm border-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <i className="fas fa-clipboard-check"></i> Board Manager
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="board-manager-header mb-4">
          <div className="d-sm-flex align-items-center justify-content-between">
            <h1 className="h3 mb-0 text-gray-800 font-weight-bold">
              <i className="fas fa-clipboard-check mr-2 text-primary"></i>
              Board Manager
            </h1>
            <Link to="/addProject" className="btn btn-primary btn-icon shadow-sm">
              <i className="fas fa-plus-circle mr-1"></i> New Project
            </Link>
          </div>
          <p className="lead text-muted mt-2">Manage and access all your project boards in one place</p>
        </div>

        {/* Filter and Search Controls */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-search text-primary"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={this.handleSearchChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text bg-white" htmlFor="statusFilter">
                      <i className="fas fa-filter text-primary"></i>
                    </label>
                  </div>
                  <select
                    className="custom-select"
                    id="statusFilter"
                    value={filterStatus}
                    onChange={this.handleFilterChange}
                  >
                    <option value="all">All Projects</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Boards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="row">
            {filteredProjects.map(project => {
              // Determine status and status classes
              const now = new Date();
              const startDate = project.start_date ? new Date(project.start_date) : null;
              const endDate = project.end_date ? new Date(project.end_date) : null;
              
              let statusText = "Not Started";
              let statusClass = "secondary";
              let statusIcon = "clock";
              
              if (endDate && now > endDate) {
                statusText = "Completed";
                statusClass = "success";
                statusIcon = "check-circle";
              } else if (startDate && now >= startDate) {
                statusText = "In Progress";
                statusClass = "primary";
                statusIcon = "spinner";
              }

              return (
                <div className="col-lg-4 col-md-6 mb-4" key={project.projectIdentifier}>
                  <div className="board-manager-card card h-100">
                    <div className={`card-status-indicator bg-${statusClass}`}></div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title font-weight-bold text-dark mb-0">
                          {project.projectName}
                        </h5>
                        <span className="badge badge-light border">
                          {project.projectIdentifier}
                        </span>
                      </div>
                      
                      <p className="card-text text-muted small mb-3">
                        {project.description ? 
                          (project.description.length > 120 ? 
                            project.description.substring(0, 120) + "..." : 
                            project.description) : 
                          "No description provided"}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <span className={`badge badge-${statusClass} mr-2`}>
                            <i className={`fas fa-${statusIcon} mr-1`}></i> {statusText}
                          </span>
                        </div>
                        <div className="text-muted small">
                          <i className="fas fa-user mr-1"></i> {project.projectLeader || "Unassigned"}
                        </div>
                      </div>
                      
                      <div className="text-center mt-3">
                        <Link 
                          to={`/projectBoard/${project.projectIdentifier}`} 
                          className="btn btn-primary btn-block btn-icon"
                        >
                          <i className="fas fa-clipboard-list mr-1"></i> Open Board
                        </Link>
                      </div>
                    </div>
                    <div className="card-footer bg-light d-flex justify-content-between">
                      <small className="text-muted">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {project.created_At ? new Date(project.created_At).toLocaleDateString() : "N/A"}
                      </small>
                      <div>
                        <Link 
                          to={`/updateProject/${project.projectIdentifier}`} 
                          className="btn btn-sm btn-light mr-2"
                          title="Edit Project"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-5 bg-light rounded">
            <div className="mb-3">
              <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
            </div>
            <h5 className="font-weight-bold text-gray-800">No Projects Found</h5>
            <p className="text-muted">
              {searchTerm || filterStatus !== "all" ? 
                "No projects match your current filters. Try changing your search criteria." : 
                "Create your first project to get started with boards."
              }
            </p>
            <Link to="/addProject" className="btn btn-primary mt-2 btn-icon">
              <i className="fas fa-plus-circle mr-1"></i> Create Project
            </Link>
          </div>
        )}
      </div>
    );
  }
}

BoardManager.propTypes = {
  project: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(BoardManager); 