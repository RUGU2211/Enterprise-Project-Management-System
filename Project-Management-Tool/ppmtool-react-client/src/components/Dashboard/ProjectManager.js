import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProjects, deleteProject } from "../../actions/projectActions";
import { Link, useNavigate } from "react-router-dom";
import CreateProjectButton from "../Project/CreateProjectButton";

const ProjectManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector(state => state.project.projects);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Stats
    const now = new Date();
    const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.end_date && new Date(p.end_date) < now).length;
  const inProgressProjects = projects.filter(p => {
    return p.start_date && new Date(p.start_date) <= now && (!p.end_date || new Date(p.end_date) >= now);
  }).length;
  const notStartedProjects = projects.filter(p => !p.start_date || new Date(p.start_date) > now).length;

  // Filtering
  let filtered = [...projects];
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.projectName?.toLowerCase().includes(term) ||
      p.projectIdentifier?.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }
  if (status !== "all") {
    filtered = filtered.filter(p => {
      if (status === "not_started") return !p.start_date || new Date(p.start_date) > now;
      if (status === "in_progress") return p.start_date && new Date(p.start_date) <= now && (!p.end_date || new Date(p.end_date) >= now);
      if (status === "completed") return p.end_date && new Date(p.end_date) < now;
      return true;
    });
  }
  if (sort === "newest") {
    filtered.sort((a, b) => new Date(b.created_At || b.createdAt) - new Date(a.created_At || a.createdAt));
  } else if (sort === "name_asc") {
    filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
  } else if (sort === "name_desc") {
    filtered.sort((a, b) => b.projectName.localeCompare(a.projectName));
  }

  // Helpers
  const formatDate = date => {
    if (!date) return "Not set";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  const getStatus = (start, end) => {
    if (!start) return { label: "Not Started", color: "warning" };
    const s = new Date(start);
    if (s > now) return { label: "Not Started", color: "warning" };
    if (end && new Date(end) < now) return { label: "Completed", color: "success" };
    return { label: "In Progress", color: "info" };
  };

  // Actions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
    }
  };

      return (
    <div className="container py-4">
      {/* Header & Stats */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="font-weight-bold mb-2">
            <i className="fas fa-clipboard-list text-primary mr-2"></i> Projects Management
          </h2>
          <div className="d-flex flex-wrap gap-3 mt-2">
            <div className="card shadow-sm border-0 mr-3 mb-2" style={{ minWidth: 180 }}>
              <div className="card-body py-3 d-flex align-items-center">
                <div className="mr-3"><i className="fas fa-clipboard-list fa-2x text-primary"></i></div>
                <div>
                  <div className="text-muted small">TOTAL PROJECTS</div>
                  <div className="h4 mb-0 font-weight-bold">{totalProjects}</div>
                </div>
              </div>
                          </div>
            <div className="card shadow-sm border-0 mr-3 mb-2" style={{ minWidth: 180 }}>
              <div className="card-body py-3 d-flex align-items-center">
                <div className="mr-3"><i className="fas fa-check-circle fa-2x text-success"></i></div>
                <div>
                  <div className="text-muted small">COMPLETED PROJECTS</div>
                  <div className="h4 mb-0 font-weight-bold">{completedProjects}</div>
                          </div>
                        </div>
                      </div>
            <div className="card shadow-sm border-0 mr-3 mb-2" style={{ minWidth: 180 }}>
              <div className="card-body py-3 d-flex align-items-center">
                <div className="mr-3"><i className="fas fa-spinner fa-2x text-info"></i></div>
                <div>
                  <div className="text-muted small">IN PROGRESS</div>
                  <div className="h4 mb-0 font-weight-bold">{inProgressProjects}</div>
                      </div>
                    </div>
                  </div>
            <div className="card shadow-sm border-0 mb-2" style={{ minWidth: 180 }}>
              <div className="card-body py-3 d-flex align-items-center">
                <div className="mr-3"><i className="fas fa-clock fa-2x text-warning"></i></div>
                <div>
                  <div className="text-muted small">NOT STARTED</div>
                  <div className="h4 mb-0 font-weight-bold">{notStartedProjects}</div>
                </div>
                      </div>
                    </div>
                  </div>
                </div>
        <div className="mt-3 mt-md-0">
          <CreateProjectButton buttonClass="btn-primary" />
                          </div>
                        </div>

      {/* Search, Filter, Sort */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <div className="d-flex align-items-center mb-3 mb-md-0">
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
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
                        </div>
                      </div>
          <div className="d-flex align-items-center">
            <select
              className="custom-select mr-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="custom-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
                    </div>
                  </div>
                </div>

      {/* Project List */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white font-weight-bold d-flex align-items-center">
          <i className="fas fa-list-ul mr-2 text-primary"></i> Project List {filtered.length > 0 && `(${filtered.length})`}
        </div>
                    <div className="card-body">
          {filtered.length === 0 ? (
            <div className="text-center p-5">
              <i className="fas fa-clipboard-list fa-3x text-light mb-3"></i>
              <h5 className="font-weight-bold text-gray-800">No Projects Found</h5>
              <p className="text-muted">Get started by creating your first project</p>
              <CreateProjectButton buttonClass="btn-primary mt-2" />
                          </div>
          ) : (
            <div className="project-list">
              {filtered.map(project => {
                const statusObj = getStatus(project.start_date, project.end_date);
                return (
                  <div key={project.id} className="card mb-3 shadow-sm border-0 project-item">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h5 className="mb-0 font-weight-bold text-dark mr-3">{project.projectName}</h5>
                            <span className="badge badge-light border text-primary mr-2">
                              <i className="fas fa-hashtag mr-1"></i>{project.projectIdentifier}
                            </span>
                            <span className={`badge badge-${statusObj.color} text-white`}>
                              <i className="fas fa-circle mr-1 small"></i>{statusObj.label}
                            </span>
                          </div>
                          <p className="text-muted mb-0">{project.description || "No description provided"}</p>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary-soft rounded-circle p-2 mr-3">
                              <i className="fas fa-user-tie text-primary"></i>
                      </div>
                            <div>
                              <div className="font-weight-bold text-dark small">PROJECT LEAD</div>
                              <div className="text-muted">{project.projectLeader || 'Not assigned'}</div>
                              <div className="text-muted small">{project.projectLeadEmail || project.email || 'No email provided'}</div>
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
                              <div className="text-muted">{formatDate(project.start_date)}</div>
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
                              <div className="text-muted">{formatDate(project.end_date)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    <div className="row">
                        <div className="col-md-4 mb-2 mb-md-0">
                          <Link
                            to={`/projectBoard/${project.projectIdentifier}`}
                            className="btn btn-primary btn-block"
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
                            onClick={() => handleDelete(project.projectIdentifier)}
                          >
                            <i className="fas fa-trash-alt mr-2"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
                    </div>
                  )}
                </div>
              </div>
              
      {/* Quick Navigation Buttons */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card dashboard-card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <Link to="/projectAnalytics" className="btn btn-primary btn-icon btn-block shadow-sm">
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
};

export default ProjectManager; 