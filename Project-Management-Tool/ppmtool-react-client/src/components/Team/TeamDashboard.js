import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTeams, reloadTeams } from "../../actions/teamActions";
import { getProjects } from "../../actions/projectActions";

class TeamDashboard extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      isLoading: false
    };
    this.onChange = this.onChange.bind(this);
    this.refreshTeams = this.refreshTeams.bind(this);
  }

  componentDidMount() {
    this.refreshTeams();
    this.props.getProjects();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  refreshTeams() {
    this.setState({ isLoading: true });
    this.props.reloadTeams()
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }));
  }

  filterTeams(teams) {
    const { searchQuery } = this.state;
    if (!searchQuery) return teams;
    
    return teams.filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  render() {
    const { teams } = this.props.team;
    const filteredTeams = this.filterTeams(teams);

    return (
      <div className="teams-dashboard py-5">
        <div className="container">
          {/* Header with enhanced gradient background */}
          <div className="dashboard-header text-center mb-5 p-0 rounded shadow-lg position-relative overflow-hidden">
            <div className="dashboard-header-bg position-absolute"></div>
            <div className="header-animated-shapes">
              <div className="animated-shape shape-1"></div>
              <div className="animated-shape shape-2"></div>
              <div className="animated-shape shape-3"></div>
            </div>
            <div className="position-relative p-5">
              <div className="header-icon-wrapper position-relative d-inline-block mb-4">
                <div className="header-icon-glow position-absolute"></div>
                <div className="header-icon-container bg-white rounded-circle shadow-lg d-flex align-items-center justify-content-center" 
                     style={{width: "100px", height: "100px", position: "relative", zIndex: "2"}}>
                  <i className="fas fa-users fa-3x" style={{color: "#1a3a8e"}}></i>
                </div>
              </div>
              <h1 className="display-4 mb-3 font-weight-bold text-on-dark" style={{letterSpacing: "0.5px", textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)"}}>Teams Dashboard</h1>
              <p className="lead mb-4 text-on-dark" style={{fontSize: "1.3rem", fontWeight: "600", textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"}}>
                Manage your project teams and collaborate efficiently
              </p>
              <div className="header-actions d-flex flex-column flex-md-row justify-content-center mb-4">
                <Link to="/createTeam" className="btn btn-light btn-lg shadow mb-3 mb-md-0 mr-md-3 px-4">
                  <i className="fas fa-plus-circle mr-2" style={{color: "#1a3a8e"}}></i> 
                  <span style={{color: "#1a3a8e", fontWeight: "600"}}>Create a Team</span>
                </Link>
                <button 
                  className="btn btn-outline-light btn-lg" 
                  onClick={this.refreshTeams}
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? (
                    <span>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
                    </span>
                  ) : (
                    <span>
                      <i className="fas fa-sync-alt mr-2"></i> Refresh Teams
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card search-card shadow border-0 mb-4">
                <div className="card-body py-3">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-white border-right-0" style={{color: "#1a3a8e"}}>
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control border-left-0 search-input"
                      placeholder="Search teams by name or description..."
                      name="searchQuery"
                      value={this.state.searchQuery}
                      onChange={this.onChange}
                      style={{color: "#333", fontWeight: "500"}}
                    />
                    {this.state.searchQuery && (
                      <div className="input-group-append">
                        <button 
                          className="btn btn-outline-secondary border-left-0 bg-white clear-button"
                          type="button"
                          onClick={() => this.setState({ searchQuery: "" })}
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="team-tabs mb-4">
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <a className="nav-link active shadow" href="#team-lead" 
                   style={{
                     background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                     borderRadius: "12px",
                     padding: "15px",
                     border: "2px solid rgba(26, 58, 142, 0.2)"
                   }}>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="tab-icon-container bg-primary-custom rounded-circle mr-3 d-flex align-items-center justify-content-center shadow" 
                         style={{width: "48px", height: "48px", minWidth: "48px"}}>
                      <i className="fas fa-user-tie fa-lg text-white"></i>
                    </div>
                    <div className="tab-content text-left">
                      <span className="font-weight-bold d-block mb-1 text-primary-dark" style={{fontSize: "1.2rem", letterSpacing: "0.5px", color: "#1a3a8e !important"}}>Teams You Lead</span>
                      <small style={{color: "#495057", fontWeight: "600"}}>Manage teams where you're the leader</small>
                    </div>
                  </div>
                </a>
              </li>
              <li className="nav-item mt-3 mt-md-0 ml-md-3">
                <a className="nav-link shadow" href="#team-member" 
                   style={{
                     background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                     borderRadius: "12px",
                     padding: "15px",
                     border: "2px solid rgba(15, 158, 93, 0.2)"
                   }}>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="tab-icon-container bg-success-custom rounded-circle mr-3 d-flex align-items-center justify-content-center shadow" 
                         style={{width: "48px", height: "48px", minWidth: "48px"}}>
                      <i className="fas fa-user-friends fa-lg text-white"></i>
                    </div>
                    <div className="tab-content text-left">
                      <span className="font-weight-bold d-block mb-1 text-success-dark" style={{fontSize: "1.2rem", letterSpacing: "0.5px", color: "#0f9e5d !important"}}>Teams You're In</span>
                      <small style={{color: "#495057", fontWeight: "600"}}>View teams where you're a member</small>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="row">
            {filteredTeams.length === 0 ? (
              <div className="col-md-12">
                <div className="empty-state text-center py-5 px-3 rounded shadow border-0 bg-white">
                  <div className="empty-state-icon bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow-sm"
                       style={{width: "120px", height: "120px", border: "3px solid rgba(26, 58, 142, 0.1)"}}>
                    {this.state.searchQuery ? (
                      <i className="fas fa-search fa-3x" style={{color: "#1a3a8e"}}></i>
                    ) : (
                      <i className="fas fa-users fa-3x" style={{color: "#1a3a8e"}}></i>
                    )}
                  </div>
                  
                  {this.state.searchQuery ? (
                    <>
                      <h4 className="font-weight-bold mb-3 text-on-light" style={{color: "#000 !important"}}>No matching teams found</h4>
                      <p className="text-on-light mb-4" style={{fontSize: "1.1rem", color: "#212529 !important", fontWeight: "500"}}>
                        We couldn't find any teams matching "<strong>{this.state.searchQuery}</strong>".
                        <br />Try a different search term or create a new team.
                      </p>
                      <div className="d-flex justify-content-center">
                        <button 
                          className="btn btn-outline-secondary mr-2 shadow-sm"
                          onClick={() => this.setState({ searchQuery: "" })}
                        >
                          <i className="fas fa-times-circle mr-1"></i> Clear Search
                        </button>
                        <Link to="/createTeam" className="btn shadow" style={{background: "#1a3a8e", color: "white"}}>
                          <i className="fas fa-plus-circle mr-1"></i> Create Team
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-weight-bold mb-3 text-on-light" style={{color: "#000 !important"}}>No Teams Created Yet</h4>
                      <p className="text-on-light mb-4" style={{fontSize: "1.1rem", color: "#212529 !important", fontWeight: "500"}}>
                        You haven't created any teams yet. Create your first team to start collaborating!
                      </p>
                      <Link to="/createTeam" className="btn btn-lg shadow px-4" style={{background: "#1a3a8e", color: "white"}}>
                        <i className="fas fa-plus-circle mr-2"></i> Create Your First Team
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : (
              filteredTeams.map(team => (
                <div className="col-lg-4 col-md-6 mb-4" key={team.id}>
                  <div className="card team-card h-100 shadow border-0 rounded-lg hover-lift">
                    {console.log("Rendering team card for team:", team)}
                    <div className="card-header p-3 d-flex align-items-center team-card-header" 
                         style={{ 
                           background: team.role === "OWNER" ? 
                             "linear-gradient(135deg, #e6a701 0%, #d09600 100%)" : 
                             team.role === "TEAM_LEAD" ? 
                             "linear-gradient(135deg, #1a3a8e 0%, #0e2356 100%)" : 
                             "linear-gradient(135deg, #0f9e5d 0%, #0b7344 100%)", 
                           borderRadius: "0.5rem 0.5rem 0 0",
                           borderBottom: "3px solid rgba(255,255,255,0.2)"
                         }}>
                      <div className="team-icon bg-white rounded-circle d-flex align-items-center justify-content-center mr-3 shadow" 
                           style={{ width: "52px", height: "52px", minWidth: "52px" }}>
                        <i className={`fas fa-${team.teamIcon || "users"} fa-lg`} 
                           style={{ color: team.role === "OWNER" ? "#e6a701" : 
                                    team.role === "TEAM_LEAD" ? "#1a3a8e" : "#0f9e5d" }}></i>
                      </div>
                      <div className="text-white flex-grow-1">
                        <h5 className="mb-0 font-weight-bold text-on-dark" style={{fontSize: "1.2rem", letterSpacing: "0.5px"}}>{team.name}</h5>
                        <small className="text-on-dark" style={{opacity: "1", fontWeight: "600"}}>
                          <i className="far fa-calendar-alt mr-1"></i>
                          Created {new Date(team.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="team-role-badge">
                        {team.role && (
                          <span className="badge badge-pill shadow-sm text-on-dark"
                            style={{
                              fontSize: "0.8rem", 
                              padding: "0.35em 0.8em",
                              background: team.role === "OWNER" ? "rgba(255,255,255,0.3)" : 
                                         team.role === "TEAM_LEAD" ? "rgba(255,255,255,0.3)" : 
                                         "rgba(255,255,255,0.3)",
                              border: "1px solid rgba(255,255,255,0.5)"
                            }}
                          >
                            {team.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <p className="card-text text-on-light flex-grow-1 mb-4" style={{fontSize: "1rem", fontWeight: "400"}}>
                        {team.description || "No description available for this team."}
                      </p>
                      
                      <div className="team-stats d-flex justify-content-around text-center mt-2 mb-3">
                        <div className="stat-box px-3 py-2 rounded shadow" 
                             style={{
                               width: "45%", 
                               background: "rgba(26, 58, 142, 0.1)", 
                               border: "1px solid rgba(26, 58, 142, 0.1)"
                             }}>
                          <div className="h4 mb-0 font-weight-bold d-flex align-items-center justify-content-center" style={{color: "#1a3a8e"}}>
                            <i className="fas fa-users mr-2"></i>
                            {team.memberCount || 1}
                          </div>
                          <small style={{color: "#1a3a8e", fontWeight: "600"}}>Members</small>
                        </div>
                        <div className="stat-box px-3 py-2 rounded shadow" 
                             style={{
                               width: "45%", 
                               background: "rgba(15, 158, 93, 0.1)", 
                               border: "1px solid rgba(15, 158, 93, 0.1)"
                             }}>
                          <div className="h4 mb-0 font-weight-bold d-flex align-items-center justify-content-center" style={{color: "#0f9e5d"}}>
                            <i className="fas fa-project-diagram mr-2"></i>
                            {team.projectCount || 0}
                          </div>
                          <small style={{color: "#0f9e5d", fontWeight: "600"}}>Projects</small>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0 p-3">
                      <div className="d-flex justify-content-between">
                        <Link to={`/team/${team.id}`} className="btn flex-grow-1 mr-2 shadow" 
                              style={{
                                background: "#1a3a8e", 
                                color: "white",
                                border: "none"
                              }}>
                          <i className="fas fa-eye mr-1"></i> Details
                        </Link>
                        <Link to={`/team/${team.id}`} className="btn flex-grow-1 shadow" 
                              style={{
                                background: "#0f9e5d", 
                                color: "white",
                                border: "none"
                              }}>
                          <i className="fas fa-cog mr-1"></i> Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <style jsx>{`
          .dashboard-header {
            background: linear-gradient(135deg, #1a3a8e 0%, #0e2356 100%);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
            margin-top: -20px;
            padding-top: 40px;
            border-radius: 12px;
          }
          
          .dashboard-header-bg {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
          }
          
          .header-animated-shapes {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
          }
          
          .animated-shape {
            position: absolute;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
          }
          
          .shape-1 {
            top: -50px;
            right: -50px;
            width: 300px;
            height: 300px;
            animation: float 12s ease-in-out infinite;
          }
          
          .shape-2 {
            bottom: -80px;
            left: 10%;
            width: 200px;
            height: 200px;
            animation: float 14s ease-in-out infinite 1s;
          }
          
          .shape-3 {
            top: 30%;
            left: 25%;
            width: 120px;
            height: 120px;
            animation: float 10s ease-in-out infinite 2s;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
            100% {
              transform: translateY(0) rotate(0deg);
            }
          }
          
          .header-icon-wrapper {
            position: relative;
            margin-bottom: 20px;
          }
          
          .header-icon-glow {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            animation: pulse 3s ease-in-out infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.5;
            }
          }
          
          .header-icon-container {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
            transition: all 0.3s ease;
          }
          
          .header-icon-container:hover {
            transform: rotate(5deg) scale(1.05);
          }
          
          .btn-light {
            background: white;
            color: #1a3a8e;
            border: none;
            font-weight: 600;
            transition: all 0.3s ease;
            transform: translateY(0);
          }
          
          .btn-light:hover {
            background: white;
            color: #0e2356;
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }
          
          .btn-outline-light {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(5px);
            border: 2px solid rgba(255, 255, 255, 0.6);
            color: white;
            font-weight: 500;
            transition: all 0.3s ease;
            transform: translateY(0);
          }
          
          .btn-outline-light:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(5px);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }
          
          .search-card {
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
            transform: translateY(-20px);
            margin-bottom: 0 !important;
            border: 1px solid rgba(26, 58, 142, 0.1) !important;
          }
          
          .search-input {
            height: 50px;
            font-size: 1rem;
          }
          
          .input-group-text {
            padding-left: 20px;
            font-size: 1.2rem;
            color: #1a3a8e;
          }
          
          .hover-lift {
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.05);
          }
          
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
          }
          
          .team-tabs {
            margin-bottom: 30px;
          }
          
          .nav-pills .nav-link {
            margin: 0;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .nav-pills .nav-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .nav-pills .nav-link.active,
          .nav-pills .nav-link:hover {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
            border: 2px solid rgba(26, 58, 142, 0.3) !important;
          }
          
          .nav-pills .nav-link:hover .text-primary-dark,
          .nav-pills .nav-link.active .text-primary-dark {
            color: #1a3a8e !important;
          }
          
          .nav-pills .nav-link:hover .text-success-dark,
          .nav-pills .nav-link.active .text-success-dark {
            color: #0f9e5d !important;
          }
          
          .tab-icon-container {
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
          }
          
          .nav-link:hover .tab-icon-container {
            transform: rotate(10deg) scale(1.1);
          }
          
          .tab-content small {
            transition: all 0.3s ease;
          }
          
          .nav-link:hover .tab-content small {
            color: #212529 !important;
          }
          
          @media (max-width: 768px) {
            .nav-pills .nav-link {
              margin-bottom: 15px;
            }
          }
          
          .text-white-50 {
            color: rgba(255, 255, 255, 0.75) !important;
          }
          
          .bg-primary-light {
            background-color: rgba(78, 115, 223, 0.1);
          }
          
          .bg-success-light {
            background-color: rgba(40, 167, 69, 0.1);
          }
          
          .text-primary-dark {
            color: #224abe;
          }
          
          .text-success-dark {
            color: #1e7e34;
          }
          
          .stat-box {
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }
          
          .stat-box:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
          }
          
          .stat-box[style*="rgba(26, 58, 142, 0.1)"] * {
            color: #0c2261 !important;
            font-weight: 600 !important;
          }
          
          .stat-box[style*="rgba(15, 158, 93, 0.1)"] * {
            color: #06703e !important;
            font-weight: 600 !important;
          }
          
          .stat-box[style*="rgba(230, 167, 1, 0.1)"] * {
            color: #8b6300 !important;
            font-weight: 600 !important;
          }
          
          .stat-box[style*="rgba(0, 0, 0, 0.7)"] *,
          .stat-box[style*="rgba(0, 0, 20, 0.7)"] *,
          .stat-box[style*="rgba(26, 58, 142, 0.8)"] * {
            color: rgba(255, 255, 255, 0.95) !important;
          }
          
          .empty-state {
            border-radius: 10px;
            background: linear-gradient(135deg, #fff 0%, #f8f9fc 100%);
          }
          
          .opacity-75 {
            opacity: 0.75;
          }
          
          /* High contrast theme colors */
          .text-primary-custom {
            color: #1a3a8e !important;
          }
          
          .text-success-custom {
            color: #0f9e5d !important;
          }
          
          .text-warning-custom {
            color: #e6a701 !important;
          }
          
          .bg-primary-custom {
            background-color: #1a3a8e !important;
            color: white !important;
          }
          
          .bg-success-custom {
            background-color: #0f9e5d !important;
            color: white !important;
          }
          
          .bg-warning-custom {
            background-color: #e6a701 !important;
            color: white !important;
          }
          
          .bg-primary-light-custom {
            background-color: rgba(26, 58, 142, 0.1) !important;
            border: 1px solid rgba(26, 58, 142, 0.1) !important;
            color: #1a3a8e !important;
          }
          
          .bg-success-light-custom {
            background-color: rgba(15, 158, 93, 0.1) !important;
            border: 1px solid rgba(15, 158, 93, 0.1) !important;
            color: #0f9e5d !important;
          }
          
          .bg-warning-light-custom {
            background-color: rgba(230, 167, 1, 0.1) !important;
            border: 1px solid rgba(230, 167, 1, 0.1) !important;
            color: #8b6300 !important;
          }
          
          /* Light and dark text contrast helpers */
          .text-on-dark {
            color: rgba(255, 255, 255, 1) !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            font-weight: 600;
          }
          
          .text-on-light {
            color: rgba(33, 37, 41, 1) !important;
            font-weight: 500;
          }
          
          /* Make text in team cards more readable */
          .team-card .card-header {
            color: white;
          }
          
          .team-card .card-body {
            color: #212529;
            font-weight: 500;
          }
          
          .team-card p {
            color: #212529 !important;
            font-weight: 500 !important;
          }
          
          .team-card small {
            font-weight: 600;
          }
          
          /* Darker text colors for stats */
          .stat-box[style*="rgba(26, 58, 142, 0.1)"] * {
            color: #0c2261 !important;
            font-weight: 600 !important;
          }
          
          .stat-box[style*="rgba(15, 158, 93, 0.1)"] * {
            color: #06703e !important;
            font-weight: 600 !important;
          }
          
          .stat-box[style*="rgba(230, 167, 1, 0.1)"] * {
            color: #8b6300 !important;
            font-weight: 600 !important;
          }
          
          /* Stronger role badges */
          .team-role-badge .badge {
            font-weight: 700 !important;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
          }
          
          /* Ensure form elements have proper contrast */
          .form-control {
            color: #212529;
            font-weight: 500;
          }
          
          .form-control::placeholder {
            color: #495057;
            opacity: 0.8;
          }
          
          /* Button contrast improvements */
          .btn {
            position: relative;
            overflow: hidden;
          }
          
          .btn-primary, 
          .btn[style*="background: #1a3a8e"], 
          .btn[style*="background: #0e2356"] {
            color: white !important;
          }
          
          .btn-success, 
          .btn[style*="background: #0f9e5d"], 
          .btn[style*="background: #0b7344"] {
            color: white !important;
          }
          
          .btn-warning, 
          .btn[style*="background: #e6a701"], 
          .btn[style*="background: #d09600"] {
            color: white !important;
          }
          
          .btn-light, 
          .btn[style*="background: white"],
          .btn[style*="background: #f8f9fa"] {
            color: #212529 !important;
          }
        `}</style>
      </div>
    );
  }
}

TeamDashboard.propTypes = {
  team: PropTypes.object.isRequired,
  getTeams: PropTypes.func.isRequired,
  reloadTeams: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  team: state.team,
  project: state.project
});

export default connect(
  mapStateToProps,
  { getTeams, reloadTeams, getProjects }
)(TeamDashboard); 