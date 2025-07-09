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
      role: "VIEWER",
      email: "",
      roles: [],
      errors: {},
      showPassword: false,
      showConfirmPassword: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    fetch('/api/users/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch roles'))
    .then(roles => this.setState({ roles }))
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
    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const email = this.state.email || this.state.username;
    const newUser = {
      username: this.state.username,
      fullName: this.state.fullName,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      role: this.state.role,
      email: email
    };
    this.props.createNewUser(newUser, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  togglePasswordVisibility = () => {
    this.setState(prev => ({ showPassword: !prev.showPassword }));
  };
  toggleConfirmPasswordVisibility = () => {
    this.setState(prev => ({ showConfirmPassword: !prev.showConfirmPassword }));
  };

  render() {
    const { errors, roles } = this.state;
    return (
      <div className="register-outer d-flex align-items-center justify-content-center min-vh-100" style={{background: "var(--color-bg)"}}>
        <div className="register-advanced-card row g-0 shadow-lg animate-fade-in">
          {/* Illustration/Visual Section */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center register-visual-section">
            <div className="register-visual-content text-center w-100">
              <i className="fas fa-user-plus fa-4x mb-4" style={{color: "var(--color-secondary)"}}></i>
              <h2 className="heading-college mb-3" style={{color: "var(--color-secondary)"}}>Join Us!</h2>
              <p className="text-muted mb-4" style={{fontSize: '1.1rem'}}>Create your account to manage projects, collaborate, and achieve more together.</p>
              <img src="/signup.jpg" alt="Sign up visual" style={{ width: '100%', borderRadius: '1.2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }} />
            </div>
          </div>
          {/* Form Section */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <div className="register-form-section w-100 p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="brand-icon mb-3">
                  <i className="fas fa-user-plus fa-2x" style={{color: "var(--color-primary)"}}></i>
                </div>
                <h1 className="heading-college mb-2" style={{color: "var(--color-primary)"}}>Create Account</h1>
                <p className="text-muted">Sign up to get started</p>
              </div>
              <button className="btn btn-outline-light w-100 mb-3 google-btn" type="button" tabIndex={-1}>
                <i className="fab fa-google me-2"></i> Sign up with Google
              </button>
              <div className="divider my-3"><span>or</span></div>
              {errors.error && (
                <div className="alert alert-danger animate-slide-down">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <strong>Registration Failed:</strong> {errors.error}
                </div>
              )}
              <form onSubmit={this.onSubmit} autoComplete="on">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={classnames("form-control", {"is-invalid": errors.fullName})}
                    placeholder="Full Name"
                    name="fullName"
                    id="fullName"
                    value={this.state.fullName}
                    onChange={this.onChange}
                    autoFocus
                  />
                  <label htmlFor="fullName">Full Name</label>
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={classnames("form-control", {"is-invalid": errors.username})}
                    placeholder="Email Address"
                    name="username"
                    id="username"
                    value={this.state.username}
                    onChange={this.onChange}
                  />
                  <label htmlFor="username">Email Address</label>
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="form-floating position-relative mb-3">
                  <input
                    type={this.state.showPassword ? "text" : "password"}
                    className={classnames("form-control", {"is-invalid": errors.password})}
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    autoComplete="new-password"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <label htmlFor="password">Password</label>
                  <div className="password-icon-box">
                    <button
                      type="button"
                      className="password-toggle-adv"
                      tabIndex={-1}
                      onClick={this.togglePasswordVisibility}
                      aria-label="Show/Hide password"
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                        fontSize: "inherit",
                        cursor: "pointer",
                        zIndex: 2
                      }}
                    >
                      <i className={`fas ${this.state.showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-floating position-relative mb-3">
                  <input
                    type={this.state.showConfirmPassword ? "text" : "password"}
                    className={classnames("form-control", {"is-invalid": errors.confirmPassword})}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.onChange}
                    autoComplete="new-password"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-icon-box">
                    <button
                      type="button"
                      className="password-toggle-adv"
                      tabIndex={-1}
                      onClick={this.toggleConfirmPasswordVisibility}
                      aria-label="Show/Hide confirm password"
                      style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        padding: 0,
                        margin: 0,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "inherit",
                        fontSize: "inherit",
                        cursor: "pointer",
                        zIndex: 2
                      }}
                    >
                      <i className={`fas ${this.state.showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
                <div className="form-floating mb-3">
                  <select
                    className={classnames("form-select", {"is-invalid": errors.role})}
                    name="role"
                    id="role"
                    value={this.state.role}
                    onChange={this.onChange}
                  >
                    {roles.map(role => (
                      <option key={role.name} value={role.name}>{role.displayName || role.name}</option>
                    ))}
                  </select>
                  <label htmlFor="role">Role</label>
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  <i className="fas fa-user-plus me-2"></i> Create Account
                </button>
                <div className="text-center mt-2">
                  <span className="text-muted">Already have an account?</span> <Link to="/login">Sign In</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style>{`
          .register-outer {
            background: var(--color-bg);
          }
          .register-advanced-card {
            background: rgba(255,255,255,0.8);
            border-radius: 2rem;
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--color-border);
            max-width: 900px;
            width: 100%;
            min-height: 480px;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            animation: fadeIn 0.8s cubic-bezier(.39,.575,.56,1.000) both;
          }
          [data-theme="dark"] .register-advanced-card {
            background: rgba(24,24,24,0.92);
            color: var(--color-pure-snow);
          }
          .register-visual-section {
            background: var(--color-clouded-pearl);
            min-height: 480px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          [data-theme="dark"] .register-visual-section {
            background: var(--color-silver-slate);
          }
          .register-visual-content img {
            max-width: 90%;
            border-radius: 1.2rem;
            margin-top: 1.5rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          }
          .register-form-section {
            background: transparent;
            min-width: 320px;
            max-width: 420px;
            margin: 0 auto;
          }
          .brand-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--color-clouded-pearl);
            margin: 0 auto 1rem auto;
            box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          }
          [data-theme="dark"] .brand-icon {
            background: var(--color-silver-slate);
          }
          .heading-college {
            font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
            font-weight: 900;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .google-btn {
            background: var(--color-clouded-pearl);
            color: var(--color-midnight-mist);
            border: 1px solid var(--color-border);
            font-weight: 700;
            border-radius: 2rem;
            transition: background 0.2s, color 0.2s;
          }
          .google-btn:hover {
            background: var(--color-secondary);
            color: var(--color-pure-snow);
          }
          .divider {
            display: flex;
            align-items: center;
            text-align: center;
            color: var(--color-text-muted);
            font-size: 0.95rem;
            margin: 1.5rem 0;
          }
          .divider::before, .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--color-border);
            margin: 0 0.75em;
          }
          .form-floating > label {
            color: var(--color-text-muted);
            font-weight: 600;
            left: 1.1rem;
          }
          .form-floating > .form-control:focus ~ label,
          .form-floating > .form-select:focus ~ label {
            color: var(--color-primary);
          }
          .form-control, .form-select {
            background: var(--color-card-bg);
            color: var(--color-text);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            transition: border 0.2s, box-shadow 0.2s;
            font-size: 1.08rem;
          }
          .form-control:focus, .form-select:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px var(--color-primary)22;
          }
          .form-control.is-invalid, .form-select.is-invalid {
            border-color: #e74a3b;
          }
          .btn-primary {
            border-radius: 2rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: var(--color-primary);
            color: var(--color-pure-snow);
            border: none;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
            transition: background 0.3s, color 0.3s, box-shadow 0.2s;
          }
          .btn-primary:hover {
            background: var(--color-secondary);
            color: var(--color-midnight-mist);
            transform: translateY(-2px) scale(1.03);
          }
          .alert {
            font-size: 1rem;
            border-radius: 1rem;
            padding: 1rem 1.2rem;
            margin-bottom: 1.2rem;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
          }
          .alert-danger {
            background: rgba(231,74,59,0.08);
            color: #e74a3b;
            border: 1px solid #e74a3b33;
          }
          .alert-warning {
            background: rgba(255,193,7,0.10);
            color: #856404;
            border: 1px solid #ffeeba;
          }
          @media (max-width: 900px) {
            .register-advanced-card {
              flex-direction: column;
              min-height: unset;
            }
            .register-visual-section {
              min-height: 180px;
              padding: 2rem 0;
            }
          }
          @media (max-width: 576px) {
            .register-form-section {
              padding: 1.2rem !important;
            }
            .register-advanced-card {
              border-radius: 1.2rem;
              padding: 0.5rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

Register.propTypes = {
  createNewUser: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  errors: state.errors
});

export default connect(mapStateToProps, { createNewUser })(Register);
