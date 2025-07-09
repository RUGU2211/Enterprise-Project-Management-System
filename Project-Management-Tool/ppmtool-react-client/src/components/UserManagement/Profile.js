import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";

import setJWTToken from "../../securityUtils/setJWTToken";

class Profile extends Component {
  constructor() {
    super();
    
    this.state = {
      id: "",
      username: "",
      fullName: "",
      email: "",
      role: "",
      roles: [],
      isEditing: false,
      errors: {},
      message: ""
    };
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }
  
  componentDidMount() {
    if (this.props.security.validToken) {
      // Get current user info from security state or fetch from backend
      const currentUser = this.props.security.user;
      if (currentUser) {
        this.setState({
          id: currentUser.id,
          username: currentUser.username,
          fullName: currentUser.fullName,
          email: currentUser.email,
          role: currentUser.role
        });
      }
    }

    // Fetch available roles
    fetch('/api/users/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': setJWTToken()
      }
    })
    .then(response => response.ok ? response.json() : [])
    .then(roles => {
      this.setState({ roles: roles });
    })
    .catch(() => {
      this.setState({ 
        roles: [
          { name: "ADMIN", displayName: "Administrator" },
          { name: "MANAGER", displayName: "Manager" },
          { name: "DEVELOPER", displayName: "Developer" },
          { name: "TESTER", displayName: "Tester" },
          { name: "VIEWER", displayName: "Viewer" },
          { name: "CUSTOM", displayName: "Custom" }
        ] 
      });
    });
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  toggleEdit() {
    this.setState({ isEditing: !this.state.isEditing, message: "", errors: {} });
  }
  
  onSubmit(e) {
    e.preventDefault();
    
    const updates = {};
    if (this.state.email !== this.props.security.user.email) {
      updates.email = this.state.email;
    }
    if (this.state.role !== this.props.security.user.role) {
      updates.role = this.state.role;
    }

    if (Object.keys(updates).length === 0) {
      this.setState({ message: "No changes to save" });
      return;
    }

    fetch(`/api/users/${this.state.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': setJWTToken()
      },
      body: JSON.stringify(updates)
    })
    .then(response => response.ok ? response.json() : Promise.reject("Failed to update profile"))
    .then(() => {
      this.setState({ 
        isEditing: false,
        message: "Profile updated successfully!",
        errors: {}
      });
      // Update the security state with new user info
      // You might need to dispatch an action to update the Redux state
    })
    .catch(error => {
      this.setState({ 
        errors: { update: error },
        message: ""
      });
    });
  }

  render() {
    const { errors, message, isEditing, fullName, email, role, roles } = this.state;
    const { security } = this.props;
    if (!security.validToken) {
      return <div>Please log in to view your profile.</div>;
    }
    // Only self or admin can edit
    const canEdit = security.user && (security.user.id === this.state.id || security.user.role === "ADMIN");
    return (
      <div className="profile">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow">
                <div className="card-header bg-white text-center py-4 border-bottom-0">
                  <div className="brand-icon mx-auto mb-3">
                    <i className="fas fa-user-circle fa-2x text-primary"></i>
                  </div>
                  <h2 className="font-weight-bold text-dark">User Profile</h2>
                  <p className="text-muted">Manage your account information</p>
                </div>
                <div className="card-body p-4">
                  {message && (
                    <div className="alert alert-success" role="alert">
                      {message}
                    </div>
                  )}
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group mb-4">
                      <label htmlFor="email" className="text-muted font-weight-bold small">Email</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-envelope text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="email"
                          className={classnames("form-control", { "is-invalid": errors.email })}
                          name="email"
                          id="email"
                          value={email || ""}
                          disabled
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="fullName" className="text-muted font-weight-bold small">Full Name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          id="fullName"
                          value={fullName || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="role" className="text-muted font-weight-bold small">Role</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user-tag text-primary"></i>
                          </span>
                        </div>
                        <select
                          className={classnames("form-control", { "is-invalid": errors.role })}
                          name="role"
                          id="role"
                          value={role}
                          onChange={this.onChange}
                          disabled={!isEditing || !canEdit}
                        >
                          {roles.map(role => (
                            <option key={role.name} value={role.name}>
                              {role.displayName}
                            </option>
                          ))}
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">{errors.role}</div>
                        )}
                      </div>
                    </div>
                    {errors.update && (
                      <div className="alert alert-danger" role="alert">
                        {errors.update}
                      </div>
                    )}
                    <div className="form-group mt-4">
                      {isEditing ? (
                        <div className="btn-group w-100" role="group">
                          <button type="submit" className="btn btn-primary">
                            <i className="fas fa-save mr-2"></i>Save Changes
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={this.toggleEdit}>
                            <i className="fas fa-times mr-2"></i>Cancel
                          </button>
                        </div>
                      ) : (
                        canEdit && (
                          <button type="button" className="btn btn-primary btn-block" onClick={this.toggleEdit}>
                            <i className="fas fa-edit mr-2"></i>Edit Role
                          </button>
                        )
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  security: state.security
});

export default connect(mapStateToProps)(Profile); 