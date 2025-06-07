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
      termsAccepted: false,
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.termsAccepted) {
      this.setState({ 
        errors: { 
          ...this.state.errors, 
          terms: "You must accept the Terms of Service and Privacy Policy to continue" 
        } 
      });
      return;
    }

    const newUser = {
      username: this.state.username,
      fullName: this.state.fullName,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };

    this.props.createNewUser(newUser, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCheckboxChange(e) {
    this.setState({ 
      termsAccepted: e.target.checked,
      errors: {
        ...this.state.errors,
        terms: e.target.checked ? "" : this.state.errors.terms
      }
    });
  }

  render() {
    const { errors, termsAccepted } = this.state;
    
    const hasErrors = errors && Object.keys(errors).length > 0;
    
    return (
      <div className="register">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow">
                <div className="card-header bg-white text-center py-4 border-bottom-0">
                  <div className="brand-icon mx-auto mb-3">
                    <i className="fas fa-clipboard-list fa-2x text-primary"></i>
                  </div>
                  <h2 className="font-weight-bold text-dark">Get Started</h2>
                  <p className="text-muted">Create your account to manage projects</p>
                </div>
                <div className="card-body p-4">
                  {hasErrors && (
                    <div className="alert alert-danger" role="alert">
                      <div className="text-center mb-2">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        <strong>Please fix the following errors</strong>
                      </div>
                      <ul className="mb-0 pl-4">
                        {Object.keys(errors).map((key, index) => (
                          <li key={index}>{errors[key]}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
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
                          placeholder="Enter your password"
                          name="password"
                          id="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
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
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-group mb-4">
                      <div className={classnames("custom-control custom-checkbox", {
                        "is-invalid": errors.terms
                      })}>
                        <input 
                          type="checkbox" 
                          className="custom-control-input" 
                          id="termsAccepted"
                          name="termsAccepted"
                          checked={termsAccepted}
                          onChange={this.onCheckboxChange}
                        />
                        <label className="custom-control-label small text-muted" htmlFor="termsAccepted">
                          I agree to the <a href="/terms" target="_blank" className="text-primary">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-primary">Privacy Policy</a>
                        </label>
                        {errors.terms && (
                          <div className="invalid-feedback d-block">{errors.terms}</div>
                        )}
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block py-2">
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
                    <i className="fas fa-shield-alt mr-1"></i> Your information is secure and encrypted
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