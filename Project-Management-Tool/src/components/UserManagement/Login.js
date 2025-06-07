import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { login } from "../../actions/securityActions";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: {},
      tokenExpired: false,
      termsAccepted: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const expired = urlParams.get('expired');
    if (expired === "true") {
      this.setState({ tokenExpired: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.security.validToken) {
      this.props.history.push("/dashboard");
    }

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

    const LoginRequest = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(LoginRequest);
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
    const { errors, tokenExpired, termsAccepted } = this.state;
    
    const hasErrors = errors && (errors.error || errors.username || errors.password || errors.terms);
    
    return (
      <div className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="card shadow">
                <div className="card-header bg-white text-center py-4 border-bottom-0">
                  <div className="brand-icon mx-auto mb-3">
                    <i className="fas fa-clipboard-list fa-2x text-primary"></i>
                  </div>
                  <h2 className="font-weight-bold text-dark">Welcome Back</h2>
                  <p className="text-muted">Sign in to access your dashboard</p>
                </div>
                <div className="card-body p-4">
                  {tokenExpired && (
                    <div className="alert alert-warning text-center" role="alert">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Your session has expired. Please login again.
                    </div>
                  )}
                  
                  {hasErrors && (
                    <div className="alert alert-danger" role="alert">
                      <div className="text-center mb-2">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        <strong>Login Failed</strong>
                      </div>
                      <ul className="mb-0 pl-4">
                        {errors.error && <li>{errors.error}</li>}
                        {errors.username && <li>{errors.username}</li>}
                        {errors.password && <li>{errors.password}</li>}
                        {errors.terms && <li>{errors.terms}</li>}
                      </ul>
                    </div>
                  )}
                  
                  <form onSubmit={this.onSubmit}>
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
                      <div className="d-flex justify-content-between">
                        <label htmlFor="password" className="text-muted font-weight-bold small">Password</label>
                        <Link to="/forgot-password" className="small text-primary">Forgot Password?</Link>
                      </div>
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
                    
                    <div className="form-group">
                      <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="rememberMe" />
                        <label className="custom-control-label small text-muted" htmlFor="rememberMe">
                          Remember me on this device
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block py-2 mt-4">
                      <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <p className="mb-0 text-muted">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-primary font-weight-bold">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="card-footer bg-light text-center py-3 border-top-0">
                  <small className="text-muted">
                    <i className="fas fa-lock mr-1"></i> Secure login with 256-bit encryption
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

Login.propTypes = {
  login: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { login }
)(Login); 