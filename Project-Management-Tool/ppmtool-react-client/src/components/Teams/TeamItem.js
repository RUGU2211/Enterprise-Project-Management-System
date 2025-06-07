import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteTeam } from "../../actions/teamActions";

class TeamItem extends Component {
  onDeleteClick = id => {
    this.props.deleteTeam(id);
  };

  render() {
    const { team } = this.props;
    
    return (
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-header bg-primary text-white">
            <h4>{team.name}</h4>
          </div>
          <div className="card-body">
            <p className="card-text">{team.description}</p>
            {team.teamIdentifier && (
              <p className="card-text"><small className="text-muted">ID: {team.teamIdentifier}</small></p>
            )}
            <div className="d-flex justify-content-between mt-3">
              <small><i className="fas fa-users mr-1"></i> {team.memberCount || 0} Members</small>
              <small><i className="fas fa-tasks mr-1"></i> {team.projectCount || 0} Projects</small>
            </div>
          </div>
          <div className="card-footer">
            <div className="btn-group" role="group">
              <Link to={`/teamBoard/${team.id}`} className="btn btn-info btn-sm">
                <i className="fas fa-clipboard-list mr-1"></i> Board
              </Link>
              <Link to={`/teamManage/${team.id}`} className="btn btn-success btn-sm">
                <i className="fas fa-user-plus mr-1"></i> Manage
              </Link>
              <Link to={`/updateTeam/${team.id}`} className="btn btn-primary btn-sm">
                <i className="fas fa-edit mr-1"></i> Edit
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={this.onDeleteClick.bind(this, team.id)}
              >
                <i className="fas fa-trash mr-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TeamItem.propTypes = {
  deleteTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired
};

export default connect(
  null,
  { deleteTeam }
)(TeamItem); 