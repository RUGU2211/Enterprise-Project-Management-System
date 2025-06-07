import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { unassignProjectFromTeam } from "../../actions/teamActions";

class TeamProjectItem extends Component {
  onUnassignClick = (teamId, projectId) => {
    this.props.unassignProjectFromTeam(teamId, projectId);
  };

  render() {
    const { project, teamId } = this.props;
    
    return (
      <div className="list-group-item list-group-item-action">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">{project.projectName}</h5>
            <p className="mb-1 text-muted">{project.description}</p>
            <div>
              <small className="text-muted mr-3">
                <i className="fas fa-calendar-alt mr-1"></i> 
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : "No start date"}
              </small>
              <small className="text-muted">
                <i className="fas fa-flag-checkered mr-1"></i>
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : "No end date"}
              </small>
            </div>
          </div>
          <div className="d-flex">
            <Link 
              to={`/projectBoard/${project.projectIdentifier}`}
              className="btn btn-sm btn-info mr-2"
            >
              <i className="fas fa-clipboard-list mr-1"></i> Board
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={this.onUnassignClick.bind(this, teamId, project.id)}
            >
              <i className="fas fa-unlink mr-1"></i> Unassign
            </button>
          </div>
        </div>
      </div>
    );
  }
}

TeamProjectItem.propTypes = {
  teamId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  unassignProjectFromTeam: PropTypes.func.isRequired
};

export default connect(
  null,
  { unassignProjectFromTeam }
)(TeamProjectItem); 