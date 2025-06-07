import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTeams } from "../../actions/teamActions";
import PropTypes from "prop-types";
import TeamItem from "./TeamItem";

class Teams extends Component {
  componentDidMount() {
    this.props.getTeams();
  }

  render() {
    const { teams } = this.props.team;
    
    return (
      <div className="teams">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Teams Dashboard</h1>
              <Link to="/createTeam" className="btn btn-lg btn-info mb-3">
                <i className="fas fa-plus-circle"></i> Create New Team
              </Link>
              
              {teams.length === 0 ? (
                <div className="alert alert-info text-center">
                  No teams found. Create a team to get started!
                </div>
              ) : (
                <div className="row">
                  {teams.map(team => (
                    <TeamItem key={team.id} team={team} />
                  ))}
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
  getTeams: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  team: state.team
});

export default connect(
  mapStateToProps,
  { getTeams }
)(Teams); 