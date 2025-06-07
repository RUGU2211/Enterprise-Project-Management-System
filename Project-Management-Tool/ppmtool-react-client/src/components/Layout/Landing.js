import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Landing extends Component {
  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="animated-bg">
          <div className="animated-shape shape1"></div>
          <div className="animated-shape shape2"></div>
          <div className="animated-shape shape3"></div>
          <div className="animated-shape shape4"></div>
        </div>
        <div className="dark-overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="landing-inner py-5">
                  <div className="logo-container mb-4 slide-down">
                    <i className="fas fa-tasks fa-4x text-light"></i>
                  </div>
                  <h1 className="display-3 mb-4 slide-up">Project Management Tool</h1>
                  <p className="lead mb-5 slide-up" style={{animationDelay: "0.2s"}}>
                    Create your account to manage projects, track tasks and collaborate with your team
                  </p>
                  <div className="buttons mb-5 slide-up" style={{animationDelay: "0.3s"}}>
                    <Link to="/register" className="btn btn-lg btn-gradient-primary me-4">
                      <i className="fas fa-user-plus me-2"></i> Sign Up
                    </Link>
                    <Link to="/login" className="btn btn-lg btn-light">
                      <i className="fas fa-sign-in-alt me-2"></i> Login
                    </Link>
                  </div>
                  
                  <div className="row mt-5 stagger-fade">
                    <div className="col-md-4 mb-4">
                      <div className="feature-card h-100">
                        <div className="feature-icon pulse">
                          <i className="fas fa-project-diagram"></i>
                        </div>
                        <h4>Manage Projects</h4>
                        <p>Create and organize your projects with ease using our intuitive interface.</p>
                        <div className="feature-bg"></div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="feature-card h-100">
                        <div className="feature-icon pulse" style={{animationDelay: "0.7s"}}>
                          <i className="fas fa-tasks"></i>
                        </div>
                        <h4>Track Tasks</h4>
                        <p>Monitor progress with task boards that show you exactly what needs to be done.</p>
                        <div className="feature-bg"></div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="feature-card h-100">
                        <div className="feature-icon pulse" style={{animationDelay: "1.4s"}}>
                          <i className="fas fa-users"></i>
                        </div>
                        <h4>Team Collaboration</h4>
                        <p>Work together efficiently with team management and real-time updates.</p>
                        <div className="feature-bg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .landing {
            background: var(--gradient-primary);
            position: relative;
            height: 100vh;
            margin-top: -80px;
            overflow: hidden;
          }
          
          .animated-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .animated-shape {
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
          
          .dark-overlay {
            background-color: rgba(0, 0, 0, 0.4);
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
          }
          
          .landing-inner {
            padding-top: 80px;
          }
          
          .display-3 {
            font-weight: 800;
            background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0.7));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
          }
          
          .lead {
            font-size: 1.4rem;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            margin: 0 auto;
            color: rgba(255, 255, 255, 0.9);
          }
          
          .btn-lg {
            padding: 0.8rem 2rem;
            font-weight: 600;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
          }
          
          .btn-lg:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 20px rgba(0, 0, 0, 0.2);
          }
          
          .btn-gradient-primary {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
            border: none;
            color: white;
            backdrop-filter: blur(5px);
          }
          
          .btn-light {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            color: var(--primary-dark);
          }
          
          .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .feature-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2.5rem 2rem;
            text-align: center;
            color: white;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          }
          
          .feature-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: 0 auto 1.5rem;
            position: relative;
            z-index: 2;
          }
          
          .feature-card h4 {
            font-weight: 700;
            margin-bottom: 1rem;
            position: relative;
            z-index: 2;
          }
          
          .feature-card p {
            color: rgba(255, 255, 255, 0.8);
            position: relative;
            z-index: 2;
          }
          
          .feature-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
            z-index: 1;
          }
          
          /* Animations */
          .slide-down {
            animation: slideDown 1s ease forwards;
          }
          
          .slide-up {
            animation: slideUp 1s ease forwards;
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
}

Landing.propTypes = {
  security: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  security: state.security
});

export default connect(mapStateToProps)(Landing);
