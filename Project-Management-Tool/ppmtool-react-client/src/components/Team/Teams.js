import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getTeams } from "../../actions/teamActions";
import TeamCard from "./TeamCard";
import Spinner from "../common/Spinner";

class Teams extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: "lead", // 'lead' or 'member'
      loading: true
    };
  }

  componentDidMount() {
    this.props.getTeams();
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  // Toggle between teams lead by user vs teams user is a member of
  toggleTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const { teams } = this.props.team;
    const { activeTab, loading } = this.state;

    // Filter teams based on active tab
    const teamsLead = teams?.filter(team => team.teamLead === this.props.username) || [];
    const teamsIn = teams?.filter(team => team.teamLead !== this.props.username) || [];
    
    const displayedTeams = activeTab === "lead" ? teamsLead : teamsIn;
    
    return (
      <div className="teams">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center mb-4">Teams Dashboard</h1>
              
              <div className="d-flex justify-content-between mb-4">
                <Link to="/createTeam" className="btn btn-primary">
                  <i className="fas fa-plus"></i> Create a Team
                </Link>
                
                <button 
                  onClick={() => this.props.getTeams()} 
                  className="btn btn-secondary"
                >
                  <i className="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="card mb-4">
                <div className="card-header bg-light p-0">
                  <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "lead" ? "active" : ""}`}
                        onClick={() => this.toggleTab("lead")}
                      >
                        <i className="fas fa-crown mr-2"></i>
                        <span className="font-weight-bold">Teams You Lead</span>
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "member" ? "active" : ""}`}
                        onClick={() => this.toggleTab("member")}
                      >
                        <i className="fas fa-user-friends mr-2"></i>
                        <span className="font-weight-bold">Teams You're In</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Team Content */}
              {loading ? (
                <Spinner />
              ) : (
                <div>
                  {activeTab === "lead" && teamsLead.length === 0 ? (
                    <div className="alert alert-info text-center">
                      You don't lead any teams yet. Create a team to get started!
                    </div>
                  ) : activeTab === "member" && teamsIn.length === 0 ? (
                    <div className="alert alert-info text-center">
                      You're not a member of any teams yet.
                    </div>
                  ) : (
                    <div className="row">
                      {displayedTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Teams.propTypes = {
  team: PropTypes.object.isRequired,
  getTeams: PropTypes.func.isRequired,
  username: PropTypes.string
};

const mapStateToProps = state => ({
  team: state.team,
  username: state.security.user.username
});

export default connect(mapStateToProps, { getTeams })(Teams); 