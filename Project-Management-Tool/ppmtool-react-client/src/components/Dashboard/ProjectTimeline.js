import React from 'react';
import { Link } from 'react-router-dom';

const ProjectTimeline = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-5">
        <div className="mb-3">
          <i className="fas fa-calendar-alt fa-3x text-light mb-3"></i>
        </div>
        <h5 className="font-weight-bold text-gray-800">No Projects Found</h5>
        <p className="text-muted">Create your first project to see the timeline</p>
        <Link to="/addProject" className="btn btn-primary mt-2 btn-icon">
          <i className="fas fa-plus-circle mr-1"></i> Create Project
        </Link>
      </div>
    );
  }

  // Sort projects by start date
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.start_date || a.created_At || new Date());
    const dateB = new Date(b.start_date || b.created_At || new Date());
    return dateA - dateB;
  });

  // Get current date for highlighting current position
  const now = new Date();

  return (
    <div className="timeline-container py-2">
      {sortedProjects.map((project, index) => {
        const startDate = new Date(project.start_date || project.created_At || now);
        const endDate = project.end_date ? new Date(project.end_date) : null;
        
        const isCompleted = endDate && now > endDate;
        const isActive = startDate <= now && (!endDate || now <= endDate);
        const isUpcoming = startDate > now;
        
        let statusClass;
        if (isCompleted) {
          statusClass = 'bg-success';
        } else if (isActive) {
          statusClass = 'bg-primary';
        } else {
          statusClass = 'bg-info';
        }

        // Calculate duration in days
        const duration = endDate ? 
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 
          'Ongoing';
        
        // Format dates
        const formatDate = (date) => {
          if (!date) return 'Not set';
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        };

        return (
          <div className="card timeline-item shadow-sm mb-3 border-0" key={project.id || index}>
            <div className="row g-0">
              <div className="col-md-2 text-center py-3">
                <div className={`badge ${statusClass} text-white px-3 py-2 mb-2`}>
                  {isCompleted ? 'Completed' : isActive ? 'Active' : 'Upcoming'}
                </div>
                <div className="timeline-date font-weight-bold">
                  {formatDate(startDate)}
                </div>
                {endDate && (
                  <div className="timeline-date text-muted small">
                    to {formatDate(endDate)}
                  </div>
                )}
              </div>
              <div className="col-md-10">
                <div className="card-body pb-2">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0 font-weight-bold">
                      <Link to={`/projectBoard/${project.projectIdentifier}`} className="text-primary">
                        {project.projectName}
                      </Link>
                    </h5>
                    <span className="badge badge-light border">
                      {project.projectIdentifier}
                    </span>
                  </div>
                  <p className="card-text text-muted">
                    {project.description && project.description.length > 150 
                      ? `${project.description.substring(0, 150)}...` 
                      : project.description || 'No description provided.'}
                  </p>
                  
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-muted small mr-2">Duration:</div>
                        <div className="font-weight-bold">
                          {typeof duration === 'number' ? `${duration} days` : duration}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="text-muted small mr-2">Lead:</div>
                        <div className="font-weight-bold">
                          {project.projectLeader || 'Not assigned'}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 text-md-right mt-3 mt-md-0">
                      <div className="btn-group btn-group-sm">
                        <Link 
                          to={`/projectBoard/${project.projectIdentifier}`} 
                          className="btn btn-outline-primary"
                        >
                          <i className="fas fa-clipboard-list mr-1"></i> Board
                        </Link>
                        <Link 
                          to={`/updateProject/${project.projectIdentifier}`} 
                          className="btn btn-outline-secondary"
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            {isActive && endDate && (
              <div className="px-3 pb-3">
                <div className="progress timeline-progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ 
                      width: `${Math.min(
                        Math.round(((now - startDate) / (endDate - startDate)) * 100), 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Start</small>
                  <small className="text-muted">End</small>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectTimeline; 