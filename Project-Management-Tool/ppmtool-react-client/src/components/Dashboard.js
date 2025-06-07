import React, { Component } from "react";
import ProjectItem from "./Project/ProjectItem";
import CreateProjectButton from "./Project/CreateProjectButton";
import { connect } from "react-redux";
import { getProjects } from "../actions/projectActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
      filterStatus: "all",
      sortOption: "newest"
    };
  }
  
  componentDidMount() {
    this.props.getProjects();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  filterProjects = () => {
    const { projects } = this.props.project;
    const { searchTerm, filterStatus, sortOption } = this.state;
    
    if (!projects) return [];
    
    let filteredProjects = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(
        project => 
          project.projectName.toLowerCase().includes(term) || 
          project.projectIdentifier.toLowerCase().includes(term) ||
          (project.description && project.description.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      const now = new Date();
      
      filteredProjects = filteredProjects.filter(project => {
        if (filterStatus === "not_started") {
          return !project.start_date || new Date(project.start_date) > now;
        } else if (filterStatus === "in_progress") {
          return project.start_date && new Date(project.start_date) <= now && 
                (!project.end_date || new Date(project.end_date) >= now);
        } else if (filterStatus === "completed") {
          return project.end_date && new Date(project.end_date) < now;
        }
        return true;
      });
    }
    
    // Apply sorting
    filteredProjects.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.created_At || b.createdAt) - new Date(a.created_At || a.createdAt);
      } else if (sortOption === "name_asc") {
        return a.projectName.localeCompare(b.projectName);
      } else if (sortOption === "name_desc") {
        return b.projectName.localeCompare(a.projectName);
      } else if (sortOption === "status") {
        const getStatusPriority = project => {
          if (!project.start_date) return 0; // Not scheduled
          
          const now = new Date();
          const startDate = new Date(project.start_date);
          
          if (startDate > now) return 1; // Not started
          
          if (project.end_date) {
            const endDate = new Date(project.end_date);
            if (now > endDate) return 3; // Completed
          }
          
          return 2; // In progress
        };
        
        return getStatusPriority(b) - getStatusPriority(a);
      }
      
      return 0;
    });
    
    return filteredProjects;
  };

  render() {
    const { projects } = this.props.project;
    const { searchTerm, filterStatus, sortOption } = this.state;
    
    const filteredProjects = this.filterProjects();
    
    const projectsContent = projects === null ? (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner"></div>
        <div className="mt-3 text-primary font-weight-bold">Loading Projects...</div>
      </div>
    ) : (
      <div className="container">
        {/* Background Image */}
        <div className="dashboard-background"></div>
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mt-3 mb-4">
          <ol className="breadcrumb bg-light shadow-sm border-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard"><i className="fas fa-home"></i> Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <i className="fas fa-clipboard-list"></i> Projects Dashboard
            </li>
          </ol>
        </nav>
        
        {/* Page Header */}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800 font-weight-bold">
            <i className="fas fa-clipboard-list mr-2 text-primary"></i>
            Projects Management
          </h1>
          <CreateProjectButton />
        </div>
        
        {/* Project Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Projects
                    </div>
                    <div className="h3 mb-0 font-weight-bold text-gray-800">
                      {projects ? projects.length : 0}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="card-icon-bg bg-primary-soft rounded-circle">
                      <i className="fas fa-clipboard-list fa-2x text-primary"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Completed Projects
                    </div>
                    <div className="h3 mb-0 font-weight-bold text-gray-800">
                      {projects ? projects.filter(p => 
                        p.end_date && new Date(p.end_date) < new Date()
                      ).length : 0}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="card-icon-bg bg-success-soft rounded-circle">
                      <i className="fas fa-check-circle fa-2x text-success"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      In Progress
                    </div>
                    <div className="h3 mb-0 font-weight-bold text-gray-800">
                      {projects ? projects.filter(p => {
                        const now = new Date();
                        return p.start_date && new Date(p.start_date) <= now && 
                              (!p.end_date || new Date(p.end_date) >= now);
                      }).length : 0}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="card-icon-bg bg-info-soft rounded-circle">
                      <i className="fas fa-spinner fa-2x text-info"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Not Started
                    </div>
                    <div className="h3 mb-0 font-weight-bold text-gray-800">
                      {projects ? projects.filter(p => 
                        !p.start_date || new Date(p.start_date) > new Date()
                      ).length : 0}
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="card-icon-bg bg-warning-soft rounded-circle">
                      <i className="fas fa-clock fa-2x text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects List Card */}
        <div className="card shadow border-0 rounded mb-4">
          <div className="card-header dashboard-card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h6 className="m-0 font-weight-bold text-primary">
              <i className="fas fa-list-ul mr-2"></i>
              Project List {filteredProjects.length > 0 && `(${filteredProjects.length})`}
            </h6>
            
            <div className="d-flex flex-column flex-md-row mt-3 mt-md-0">
              <div className="d-flex mr-2 mb-2 mb-md-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white border-right-0">
                      <i className="fas fa-search text-primary"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control border-left-0"
                    placeholder="Search projects..."
                    name="searchTerm"
                    value={searchTerm}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              
              <div className="d-flex">
                <select
                  className="custom-select mr-2"
                  name="filterStatus"
                  value={filterStatus}
                  onChange={this.onChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <select
                  className="custom-select"
                  name="sortOption"
                  value={sortOption}
                  onChange={this.onChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="status">By Status</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            {filteredProjects.length === 0 ? (
              <div className="text-center p-5">
                <div className="mb-3">
                  <i className="fas fa-clipboard-list fa-3x text-light mb-3"></i>
                </div>
                {projects && projects.length > 0 ? (
                  <>
                    <h5 className="font-weight-bold text-gray-800">No matching projects found</h5>
                    <p className="text-muted">Try adjusting your search criteria</p>
                    <button 
                      onClick={() => this.setState({ searchTerm: "", filterStatus: "all" })}
                      className="btn btn-primary mt-2"
                    >
                      <i className="fas fa-sync-alt mr-1"></i> Reset Filters
                    </button>
                  </>
                ) : (
                  <>
                    <h5 className="font-weight-bold text-gray-800">No Projects Found</h5>
                    <p className="text-muted">Get started by creating your first project</p>
                    <CreateProjectButton buttonClass="btn-primary mt-2" />
                  </>
                )}
              </div>
            ) : (
              <div className="project-list">
                {filteredProjects.map(project => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card dashboard-card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <Link to="/projectManager" className="btn btn-primary btn-icon btn-block shadow-sm">
                      <i className="fas fa-chart-line mr-2"></i> Project Analytics
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <Link to="/teams" className="btn btn-info btn-icon btn-block shadow-sm">
                      <i className="fas fa-users mr-2"></i> Manage Teams
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/boardManager" className="btn btn-secondary btn-icon btn-block shadow-sm">
                      <i className="fas fa-tasks mr-2"></i> Board Manager
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="projects py-4">
        {projectsContent}
      </div>
    );
  }
}

Dashboard.propTypes = {
  project: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.project
});

export default connect(mapStateToProps, { getProjects })(Dashboard);
