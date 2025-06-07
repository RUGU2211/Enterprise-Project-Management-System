import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CreateProjectButton = ({ buttonClass }) => {
  return (
    <Link to="/addProject" className={`btn ${buttonClass || 'btn-primary'} btn-icon shadow-sm`}>
      <i className="fas fa-plus-circle mr-1"></i> Create Project
    </Link>
  );
};

CreateProjectButton.propTypes = {
  buttonClass: PropTypes.string
};

export default CreateProjectButton;
