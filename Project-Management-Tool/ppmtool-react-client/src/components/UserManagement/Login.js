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
      isLoading: false,
      showPassword: false,
      tokenExpired: false
    };
    this.timeoutId = null;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
  }

  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
      this.setState({ tokenExpired: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors !== prevProps.errors) {
      this.setState({ errors: this.props.errors, loading: false });
    }
    if (this.props.security.validToken && !prevProps.security.validToken) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const LoginRequest = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.login(LoginRequest);
    this.timeoutId = setTimeout(() => {
      if (this.state.isLoading) {
        this.setState({ isLoading: false });
      }
    }, 3000);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  togglePasswordVisibility() {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  render() {
    const { errors, tokenExpired, showPassword, isLoading } = this.state;
    const hasErrors = errors && (errors.error || errors.username || errors.password);
    return (
      <div className="login-outer d-flex align-items-center justify-content-center min-vh-100" style={{background: "var(--color-bg)"}}>
        <div className="login-advanced-card row g-0 shadow-lg animate-fade-in">
          {/* Illustration/Visual Section */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center login-visual-section">
            <div className="login-visual-content text-center w-100">
              <i className="fas fa-user-shield fa-4x mb-4" style={{color: "var(--color-secondary)"}}></i>
              <h2 className="heading-college mb-3" style={{color: "var(--color-secondary)"}}>Welcome Back!</h2>
              <p className="text-muted mb-4" style={{fontSize: '1.1rem'}}>Manage your projects, teams, and tasks with confidence.<br/>Secure, fast, and easy access.</p>
              <img src="/login.jpg" alt="Login visual" style={{ width: '100%', borderRadius: '1.2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }} />
        </div>
                  </div>
          {/* Form Section */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <div className="login-form-section w-100 p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="brand-icon mb-3">
                  <i className="fas fa-clipboard-list fa-2x" style={{color: "var(--color-primary)"}}></i>
                </div>
                <h1 className="heading-college mb-2" style={{color: "var(--color-primary)"}}>Login</h1>
                <p className="text-muted">Login to your account</p>
              </div>
              <button className="btn btn-outline-light w-100 mb-3 google-btn" type="button" tabIndex={-1}>
                <i className="fab fa-google me-2"></i> Continue with Google
              </button>
              <div className="divider my-3"><span>or</span></div>
                  {tokenExpired && (
                <div className="alert alert-warning animate-slide-down">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                        Your session has expired. Please login again.
                    </div>
                  )}
                  {hasErrors && (
                <div className="alert alert-danger animate-slide-down">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <strong>Login Failed:</strong>
                  <ul className="mb-0">
                          {errors.error && <li>{errors.error}</li>}
                          {errors.username && <li>{errors.username}</li>}
                          {errors.password && <li>{errors.password}</li>}
                        </ul>
                    </div>
                  )}
              <form onSubmit={this.onSubmit} autoComplete="on">
                <div className="form-floating mb-3">
                        <input
                          type="text"
                    className={classnames("form-control", {"is-invalid": errors.username})}
                    placeholder="Email Address"
                          name="username"
                          id="username"
                          value={this.state.username}
                          onChange={this.onChange}
                    autoFocus
                        />
                  <label htmlFor="username">Email Address</label>
                        {errors.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                <div className="form-floating mb-3 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                    className={classnames("form-control", {"is-invalid": errors.password})}
                    placeholder="Password"
                          name="password"
                          id="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                  <label htmlFor="password">Password</label>
                  <button type="button" className="btn btn-link password-toggle-adv" tabIndex={-1} onClick={this.togglePasswordVisibility} aria-label="Show/Hide password">
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                  {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-sign-in-alt me-2"></i>}
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <div className="text-center mt-2">
                  <span className="text-muted">Don't have an account?</span> <Link to="/register">Sign Up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style>{`
          .login-outer {
            background: var(--color-bg);
          }
          .login-advanced-card {
            background: rgba(255,255,255,0.8);
            border-radius: 2rem;
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--color-border);
            max-width: 850px;
            width: 100%;
            min-height: 420px;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            animation: fadeIn 0.8s cubic-bezier(.39,.575,.56,1.000) both;
          }
          [data-theme="dark"] .login-advanced-card {
            background: rgba(24,24,24,0.92);
            color: var(--color-pure-snow);
          }
          .login-visual-section {
            background: var(--color-clouded-pearl);
            min-height: 420px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          [data-theme="dark"] .login-visual-section {
            background: var(--color-silver-slate);
          }
          .login-visual-content img {
            max-width: 90%;
            border-radius: 1.2rem;
            margin-top: 1.5rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          }
          .login-form-section {
            background: transparent;
            min-width: 320px;
            max-width: 400px;
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
          .form-floating > .form-control:focus ~ label {
            color: var(--color-primary);
          }
          .form-control {
            background: var(--color-card-bg);
            color: var(--color-text);
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            transition: border 0.2s, box-shadow 0.2s;
            font-size: 1.08rem;
          }
          .form-control:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px var(--color-primary)22;
          }
          .form-control.is-invalid {
            border-color: #e74a3b;
          }
          .password-toggle-adv {
            color: var(--color-secondary);
            border: none;
            background: transparent;
            font-size: 1.1rem;
            position: absolute;
            right: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
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
          .forgot-link {
            color: var(--color-secondary);
            font-size: 0.95rem;
            text-decoration: underline;
          }
          .forgot-link:hover {
            color: var(--color-primary);
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
            .login-advanced-card {
              flex-direction: column;
              min-height: unset;
            }
            .login-visual-section {
              min-height: 180px;
              padding: 2rem 0;
            }
          }
          @media (max-width: 576px) {
            .login-form-section {
              padding: 1.2rem !important;
            }
            .login-advanced-card {
              border-radius: 1.2rem;
              padding: 0.5rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  security: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security,
  errors: state.errors
});

export default connect(mapStateToProps, { login })(Login);
