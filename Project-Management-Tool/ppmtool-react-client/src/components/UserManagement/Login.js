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
      showPassword: false,
      isLoading: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
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
      this.setState({ errors: nextProps.errors, isLoading: false });
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
    
    // If login doesn't fail immediately, we'll reset loading state in componentWillReceiveProps
    setTimeout(() => {
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
      <div className="login">
        <div className="login-bg">
          <div className="login-animated-shape shape1"></div>
          <div className="login-animated-shape shape2"></div>
          <div className="login-animated-shape shape3"></div>
          <div className="login-animated-shape shape4"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="login-card slide-up">
                <div className="card-header text-center">
                  <div className="brand-icon pulse">
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <h2>Welcome Back</h2>
                  <p>Sign in to access your dashboard</p>
                </div>
                <div className="card-body">
                  {tokenExpired && (
                    <div className="alert-message warning slide-down">
                      <div className="alert-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="alert-content">
                        Your session has expired. Please login again.
                      </div>
                    </div>
                  )}
                  
                  {hasErrors && (
                    <div className="alert-message danger slide-down">
                      <div className="alert-icon">
                        <i className="fas fa-exclamation-circle"></i>
                      </div>
                      <div className="alert-content">
                        <strong>Login Failed</strong>
                        <ul>
                          {errors.error && <li>{errors.error}</li>}
                          {errors.username && <li>{errors.username}</li>}
                          {errors.password && <li>{errors.password}</li>}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Email Address</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <i className="fas fa-envelope"></i>
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
                      <div className="label-row">
                        <label htmlFor="password">Password</label>
                        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                      </div>
                      <div className="input-group">
                        <div className="input-icon">
                          <i className="fas fa-lock"></i>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={classnames("form-control", {
                            "is-invalid": errors.password
                          })}
                          placeholder="Enter your password"
                          name="password"
                          id="password"
                          value={this.state.password}
                          onChange={this.onChange}
                        />
                        <div className="password-toggle" onClick={this.togglePasswordVisibility}>
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </div>
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="checkbox-wrapper">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="rememberMe">
                          Remember me on this device
                        </label>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className={`submit-btn ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner">
                            <i className="fas fa-circle-notch fa-spin"></i>
                          </span>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt"></i>
                          <span>Sign In</span>
                        </>
                      )}
                    </button>
                  </form>
                  <div className="signup-link">
                    <p>
                      Don't have an account?{" "}
                      <Link to="/register">
                        Create Account
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="card-footer">
                  <i className="fas fa-lock"></i>
                  <span>Secure login with 256-bit encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .login {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 2rem 0;
            position: relative;
            overflow: hidden;
          }
          
          .login-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient-primary);
            z-index: -1;
          }
          
          .login-animated-shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
          }
          
          .shape1 {
            width: 600px;
            height: 600px;
            bottom: -300px;
            right: -150px;
            animation: float 25s infinite ease-in-out;
          }
          
          .shape2 {
            width: 400px;
            height: 400px;
            top: -200px;
            left: -150px;
            animation: float 20s infinite ease-in-out reverse;
          }
          
          .shape3 {
            width: 300px;
            height: 300px;
            top: 30%;
            right: 20%;
            animation: float 18s infinite ease-in-out;
            animation-delay: -5s;
          }
          
          .shape4 {
            width: 200px;
            height: 200px;
            bottom: 20%;
            left: 20%;
            animation: float 15s infinite ease-in-out reverse;
            animation-delay: -8s;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            25% {
              transform: translateY(-30px) rotate(5deg);
            }
            50% {
              transform: translateY(0) rotate(0deg);
            }
            75% {
              transform: translateY(30px) rotate(-5deg);
            }
          }
          
          .login-card {
            background-color: var(--card-bg);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            transition: all 0.3s ease;
            transform: translateY(20px);
            opacity: 0;
            animation: slideUp 0.5s ease forwards;
          }
          
          @keyframes slideUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .card-header {
            padding: 2.5rem 2rem 1.5rem;
            background: rgba(0, 0, 0, 0.02);
            border-bottom: 1px solid var(--border-color);
            text-align: center;
          }
          
          [data-theme="dark"] .card-header {
            background: rgba(255, 255, 255, 0.02);
          }
          
          .brand-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          .card-header h2 {
            color: var(--text);
            font-weight: 700;
            margin-bottom: 0.5rem;
            font-size: 1.75rem;
          }
          
          .card-header p {
            color: var(--text-muted);
            margin-bottom: 0;
          }
          
          .card-body {
            padding: 2rem;
          }
          
          .alert-message {
            display: flex;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            animation: slideDown 0.3s ease forwards;
            transition: all 0.3s ease;
            transform: translateY(-20px);
            opacity: 0;
          }
          
          @keyframes slideDown {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .alert-message.warning {
            background-color: rgba(var(--warning), 0.1);
            border-left: 3px solid var(--warning);
          }
          
          .alert-message.danger {
            background-color: rgba(var(--danger), 0.1);
            border-left: 3px solid var(--danger);
          }
          
          .alert-icon {
            width: 24px;
            margin-right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .alert-message.warning .alert-icon {
            color: var(--warning);
          }
          
          .alert-message.danger .alert-icon {
            color: var(--danger);
          }
          
          .alert-content {
            flex: 1;
          }
          
          .alert-content strong {
            font-weight: 600;
            display: block;
            margin-bottom: 0.25rem;
          }
          
          .alert-content ul {
            margin: 0;
            padding-left: 1.5rem;
            font-size: 0.9rem;
          }
          
          .form-group {
            margin-bottom: 1.5rem;
          }
          
          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text);
          }
          
          .label-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }
          
          .forgot-link {
            font-size: 0.85rem;
            color: var(--primary);
            text-decoration: none;
            transition: all 0.2s ease;
          }
          
          .forgot-link:hover {
            color: var(--primary-dark);
            text-decoration: underline;
          }
          
          .input-group {
            position: relative;
          }
          
          .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            transition: all 0.3s ease;
            z-index: 2;
          }
          
          .form-control {
            height: 50px;
            padding-left: 45px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            background-color: var(--card-bg);
            color: var(--text);
            box-shadow: none;
            transition: all 0.3s ease;
            font-size: 1rem;
          }
          
          .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(var(--primary), 0.2);
          }
          
          .form-control:focus + .input-icon {
            color: var(--primary);
          }
          
          .form-control::placeholder {
            color: var(--text-muted);
            opacity: 0.6;
          }
          
          .invalid-feedback {
            display: block;
            width: 100%;
            margin-top: 0.25rem;
            font-size: 80%;
            color: var(--danger);
          }
          
          .password-toggle {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            cursor: pointer;
            z-index: 5;
            transition: all 0.2s ease;
          }
          
          .password-toggle:hover {
            color: var(--primary);
          }
          
          .checkbox-wrapper {
            display: flex;
            align-items: center;
          }
          
          .checkbox-wrapper input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }
          
          .checkbox-wrapper label {
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-bottom: 0;
            color: var(--text-muted);
            font-weight: 400;
          }
          
          .checkbox-wrapper label:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            border: 2px solid var(--border-color);
            border-radius: 5px;
            transition: all 0.2s ease;
          }
          
          .checkbox-wrapper input:checked + label:before {
            background-color: var(--primary);
            border-color: var(--primary);
          }
          
          .checkbox-wrapper input:focus + label:before {
            box-shadow: 0 0 0 3px rgba(var(--primary), 0.2);
          }
          
          .checkbox-wrapper label:after {
            content: '';
            position: absolute;
            left: 7px;
            top: 4px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            opacity: 0;
            transition: all 0.2s ease;
          }
          
          .checkbox-wrapper input:checked + label:after {
            opacity: 1;
          }
          
          .submit-btn {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            padding: 0 1.5rem;
            margin-top: 1rem;
            box-shadow: 0 4px 10px rgba(var(--primary), 0.2);
          }
          
          .submit-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(var(--primary), 0.3);
          }
          
          .submit-btn:active {
            transform: translateY(-1px);
          }
          
          .submit-btn i {
            margin-right: 0.75rem;
            font-size: 1rem;
          }
          
          .submit-btn.loading {
            opacity: 0.8;
            cursor: not-allowed;
          }
          
          .spinner {
            margin-right: 0.75rem;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
          .signup-link {
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
          }
          
          .signup-link p {
            margin-bottom: 0;
            color: var(--text-muted);
          }
          
          .signup-link a {
            color: var(--primary);
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }
          
          .signup-link a:hover {
            text-decoration: underline;
          }
          
          .card-footer {
            background: rgba(0, 0, 0, 0.02);
            padding: 1rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.85rem;
            border-top: 1px solid var(--border-color);
          }
          
          [data-theme="dark"] .card-footer {
            background: rgba(255, 255, 255, 0.02);
          }
          
          .card-footer i {
            margin-right: 0.5rem;
          }
        `}</style>
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
