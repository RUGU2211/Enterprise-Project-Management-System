import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { SET_USER_PROFILE } from "../../actions/types";
import { logout } from "../../actions/securityActions";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Profile extends Component {
  constructor() {
    super();
    
    this.state = {
      fullName: "",
      username: "",
      role: "USER",
      roles: [
        { name: "ADMIN", displayName: "Administrator" },
        { name: "DEVELOPER", displayName: "Developer" },
        { name: "TESTER", displayName: "Tester" },
        { name: "USER", displayName: "Standard User" }
      ],
      errors: {},
      loading: false,
      success: false,
      showDeleteModal: false,
      deleteError: null
    };
    
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDeleteAccount = this.onDeleteAccount.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }
  
  componentDidMount() {
    // Use data from JWT token instead of fetching from API
    const { user } = this.props.security;
    
    if (user && user.fullName) {
      this.setState({
        fullName: user.fullName,
        username: user.username,
        role: user.authorities ? user.authorities[0] : "USER",
        loading: false
      });
      
      // Store profile in Redux for consistency
      this.props.setUserProfile({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.authorities ? user.authorities[0] : "USER"
      });
    }
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onSubmit(e) {
    e.preventDefault();
    
    const updatedUser = {
      fullName: this.state.fullName,
      role: this.state.role
    };
    
    // Since we don't have a profile API endpoint, just update the profile in Redux
    this.props.setUserProfile({
      ...this.props.security.user,
      fullName: updatedUser.fullName,
      role: updatedUser.role
    });
    
    // Show success message
    this.setState({ success: true });
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.setState({ success: false });
    }, 3000);
  }
  
  toggleDeleteModal() {
    this.setState(prevState => ({
      showDeleteModal: !prevState.showDeleteModal,
      deleteError: null
    }));
  }

  async onDeleteAccount() {
    try {
      this.setState({ loading: true, deleteError: null });
      
      await axios.delete(`/api/users/${this.props.security.user.id}`);
      
      // Logout the user after successful deletion
      this.props.logout();
      
      // Redirect to login page
      this.props.history.push("/login");
    } catch (error) {
      this.setState({
        deleteError: error.response?.data || "Failed to delete account. Please try again.",
        loading: false
      });
    }
  }

  render() {
    const { errors, loading, success, roles, showDeleteModal, deleteError } = this.state;
    
    if (loading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-lg-6 m-auto">
              <div className="card shadow">
                <div className="card-header bg-white py-4 border-bottom-0">
                  <h2 className="text-center font-weight-bold text-dark">User Profile</h2>
                </div>
                <div className="card-body p-4">
                  {success && (
                    <div className="alert alert-success" role="alert">
                      Profile updated successfully!
                    </div>
                  )}
                  {errors.error && (
                    <div className="alert alert-danger" role="alert">
                      {errors.error}
                    </div>
                  )}
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="username" className="text-muted font-weight-bold small">Email Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={this.state.username}
                        disabled
                      />
                      <small className="form-text text-muted">Email cannot be changed</small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="fullName" className="text-muted font-weight-bold small">Full Name</label>
                      <input
                        type="text"
                        className={classnames("form-control", {
                          "is-invalid": errors.fullName
                        })}
                        placeholder="Full Name"
                        name="fullName"
                        value={this.state.fullName}
                        onChange={this.onChange}
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">{errors.fullName}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="role" className="text-muted font-weight-bold small">Role</label>
                      <select
                        className={classnames("form-control", {
                          "is-invalid": errors.role
                        })}
                        name="role"
                        value={this.state.role}
                        onChange={this.onChange}
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
                    <button type="submit" className="btn btn-primary btn-block mt-4">
                      <i className="fas fa-user-edit mr-2"></i>Update Profile
                    </button>
                  </form>
                  
                  <hr className="my-4" />
                  
                  <div className="text-center">
                    <button 
                      className="btn btn-danger"
                      onClick={this.toggleDeleteModal}
                    >
                      <i className="fas fa-user-times mr-2"></i>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Account</h5>
                  <button type="button" className="close" onClick={this.toggleDeleteModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {deleteError && (
                    <div className="alert alert-danger">{deleteError}</div>
                  )}
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={this.toggleDeleteModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={this.onDeleteAccount}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    );
  }
}

Profile.propTypes = {
  setUserProfile: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  errors: state.errors
});

const mapDispatchToProps = dispatch => ({
  setUserProfile: (profile) => dispatch({
    type: SET_USER_PROFILE,
    payload: profile
  }),
  logout
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile)); 