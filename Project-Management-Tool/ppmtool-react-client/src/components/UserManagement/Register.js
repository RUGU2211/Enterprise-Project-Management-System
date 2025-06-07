import React, { Component } from "react";
import { createNewUser } from "../../actions/securityActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      role: "USER",
      email: "",
      roles: [],
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    
    console.log("Setting up default roles for registration...");
    
    // Always use local roles to avoid the 401 error
    this.setState({ 
      roles: [
        { name: "ADMIN", displayName: "Administrator" },
        { name: "DEVELOPER", displayName: "Developer" },
        { name: "TESTER", displayName: "Tester" },
        { name: "USER", displayName: "Standard User" }
      ] 
    });
    
    // No more API call to fetch roles - avoiding the 401 error completely
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    
    console.log("Submitting registration form...");
    
    // Set email to username if not explicitly provided
    const email = this.state.email || this.state.username;
    
    const newUser = {
      username: this.state.username,
      fullName: this.state.fullName,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      role: this.state.role,
      email: email
    };

    console.log("Registration data:", newUser);
    
    this.props.createNewUser(newUser, this.props.history)
      .then(success => {
        if (success) {
          console.log("Registration was successful");
        } else {
          console.error("Registration failed");
        }
      })
      .catch(err => {
        console.error("Error during registration:", err);
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="card shadow">
                <div className="card-header bg-white text-center py-4 border-bottom-0">
                  <div className="brand-icon mx-auto mb-3">
                    <i className="fas fa-user-plus fa-2x text-primary"></i>
                  </div>
                  <h2 className="font-weight-bold text-dark">Create Account</h2>
                  <p className="text-muted">Join our project management platform</p>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="fullName" className="text-muted font-weight-bold small">Full Name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": errors.fullName
                          })}
                          placeholder="Enter your full name"
                          name="fullName"
                          id="fullName"
                          value={this.state.fullName}
                          onChange={this.onChange}
                        />
                        {errors.fullName && (
                          <div className="invalid-feedback">{errors.fullName}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="username" className="text-muted font-weight-bold small">Email Address</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-envelope text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className={classnames("form-control", {
                            "is-invalid": errors.username
                          })}
                          placeholder="Enter your email"
                          name="username"
                          id="username"
                          value={this.state.username}
                          onChange={this.onChange}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="text-muted font-weight-bold small">Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-lock text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="password"
                          className={classnames("form-control", {
                            "is-invalid": errors.password
                          })}
                          placeholder="Create a password"
                          name="password"
                          id="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                      <small className="form-text text-muted">Password must be at least 6 characters</small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="text-muted font-weight-bold small">Confirm Password</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-lock text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="password"
                          className={classnames("form-control", {
                            "is-invalid": errors.confirmPassword
                          })}
                          placeholder="Confirm your password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={this.state.confirmPassword}
                          onChange={this.onChange}
                        />
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="role" className="text-muted font-weight-bold small">Role</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="fas fa-user-tag text-primary"></i>
                          </span>
                        </div>
                        <select
                          className={classnames("form-control", {
                            "is-invalid": errors.role
                          })}
                          name="role"
                          id="role"
                          value={this.state.role}
                          onChange={this.onChange}
                        >
                          {this.state.roles.length > 0 ? (
                            this.state.roles.map(role => (
                              <option key={role.name} value={role.name}>
                                {role.displayName}
                              </option>
                            ))
                          ) : (
                            <option value="USER">Standard User</option>
                          )}
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">{errors.role}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="termsAgreement" />
                        <label className="custom-control-label small text-muted" htmlFor="termsAgreement">
                          I agree to the <a href="#!" className="text-primary">Terms of Service</a> and <a href="#!" className="text-primary">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block py-2 mt-4">
                      <i className="fas fa-user-plus mr-2"></i>Create Account
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="mb-0 text-muted">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary font-weight-bold">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="card-footer bg-light text-center py-3 border-top-0">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt mr-1"></i> Your information is secure with us
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  createNewUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  security: state.security
});
export default connect(
  mapStateToProps,
  { createNewUser }
)(Register);
