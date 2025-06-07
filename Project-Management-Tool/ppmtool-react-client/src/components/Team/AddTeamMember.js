import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addTeamMember } from "../../actions/teamActions";
import classnames from "classnames";

class AddTeamMember extends Component {
  constructor() {
    super();
    this.state = {
      userId: "",
      role: "DEVELOPER", // Default role
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
    
    const memberData = {
      userId: this.state.userId,
      role: this.state.role
    };
    
    this.props.addTeamMember(this.props.teamId, memberData);
    // Close the modal only if no errors
    if (Object.keys(this.state.errors).length === 0) {
      this.props.onClose();
    }
  };

  render() {
    const { errors } = this.state;
    const { show, users, onClose } = this.props;
    
    if (!show) {
      return null;
    }

    return (
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-user-plus mr-2"></i>
                Add Team Member
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
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Select User</label>
                  <select
                    className={classnames("form-control", {
                      "is-invalid": errors.userId
                    })}
                    name="userId"
                    value={this.state.userId}
                    onChange={this.onChange}
                  >
                    <option value="">-- Select User --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <div className="invalid-feedback">{errors.userId}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    name="role"
                    value={this.state.role}
                    onChange={this.onChange}
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="TESTER">Tester</option>
                    <option value="TEAM_LEAD">Team Lead</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                  </select>
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
                    className="btn btn-primary"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </div>
    );
  }
}

AddTeamMember.propTypes = {
  teamId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  addTeamMember: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addTeamMember }
)(AddTeamMember); 