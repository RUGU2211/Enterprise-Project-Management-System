import React, { Component } from "react";
import PropTypes from "prop-types";

class TeamMemberItem extends Component {
  onRemoveClick = (teamId, userId) => {
    this.props.onRemove(teamId, userId);
  };

  render() {
    const { member, teamId } = this.props;
    
    return (
      <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        <div>
          <div className="d-flex align-items-center">
            <div className="avatar-circle mr-3">
              <span className="initials">
                {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <h5 className="mb-1">{member.fullName || "Unknown User"}</h5>
              <small className="text-muted">{member.email || "No email provided"}</small>
              {member.role && (
                <span className={`badge ml-2 
                  ${member.role === "TEAM_LEAD" ? "badge-primary" : 
                  member.role === "DEVELOPER" ? "badge-info" : 
                  member.role === "TESTER" ? "badge-warning" : 
                  "badge-secondary"}`}>
                  {member.role.replace("_", " ")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={this.onRemoveClick.bind(this, teamId, member.id)}
          >
            <i className="fas fa-user-minus mr-1"></i> Remove
          </button>
        </div>
      </div>
    );
  }
}

TeamMemberItem.propTypes = {
  teamId: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TeamMemberItem; 