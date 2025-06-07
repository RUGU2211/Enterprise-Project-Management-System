import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { assignProjectToTeam } from "../../actions/teamActions";
import classnames from "classnames";

class AssignProject extends Component {
  constructor() {
    super();
    this.state = {
      projectId: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    
    this.props.assignProjectToTeam(this.props.teamId, this.state.projectId);
    
    // Close the modal only if no errors
    if (Object.keys(this.state.errors).length === 0) {
      this.props.onClose();
    }
  };

  render() {
    const { errors } = this.state;
    const { show, projects, onClose } = this.props;
    
    if (!show) {
      return null;
    }

    // Filter out projects that are already assigned to this team
    const assignedProjectIds = this.props.assignedProjects.map(p => p.id);
    const availableProjects = projects.filter(p => !assignedProjectIds.includes(p.id));

    return (
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                <i className="fas fa-project-diagram mr-2"></i>
                Assign Project to Team
              </h5>
              <button 
                type="button" 
                className="close text-white" 
                onClick={onClose}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {availableProjects.length === 0 ? (
                <div className="alert alert-info">
                  There are no available projects to assign to this team.
                </div>
              ) : (
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label>Select Project</label>
                    <select
                      className={classnames("form-control", {
                        "is-invalid": errors.projectId
                      })}
                      name="projectId"
                      value={this.state.projectId}
                      onChange={this.onChange}
                    >
                      <option value="">-- Select Project --</option>
                      {availableProjects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.projectName} ({project.projectIdentifier})
                        </option>
                      ))}
                    </select>
                    {errors.projectId && (
                      <div className="invalid-feedback">{errors.projectId}</div>
                    )}
                  </div>
                  <div className="form-group text-right">
                    <button 
                      type="button" 
                      className="btn btn-secondary mr-2"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-success"
                    >
                      Assign Project
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

AssignProject.propTypes = {
  teamId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  assignedProjects: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  assignProjectToTeam: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { assignProjectToTeam }
)(AssignProject); 