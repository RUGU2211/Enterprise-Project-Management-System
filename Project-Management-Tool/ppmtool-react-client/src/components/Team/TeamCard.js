import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const TeamCard = ({ team }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-header bg-primary text-white py-3">
          <h5 className="card-title mb-1 font-weight-bold">
            <i className="fas fa-project-diagram mr-2"></i>
            {team.name}
          </h5>
          <p className="card-text mb-0 opacity-100 small font-weight-bold">
            Projects assigned to team "{team.name}"
          </p>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <h6 className="font-weight-bold text-dark">Team Lead:</h6>
              <span className="badge badge-primary">{team.teamLead}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <h6 className="font-weight-bold text-dark">Members:</h6>
              <span className="badge badge-info">
                {team.memberCount || (team.members ? team.members.length : 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="font-weight-bold text-dark">Projects:</h6>
              <span className="badge badge-success">
                {team.projectCount || (team.projects ? team.projects.length : 0)}
              </span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to={`/team/${team.id}`} className="btn btn-primary shadow-sm mr-2">
              <i className="fas fa-info-circle mr-1"></i> Details
            </Link>
            <Link to={`/teamManage/${team.id}`} className="btn btn-secondary shadow-sm">
              <i className="fas fa-cog mr-1"></i> Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

TeamCard.propTypes = {
  team: PropTypes.object.isRequired
};

export default TeamCard; 