import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

class About extends Component {
  componentDidMount() {
    // Add page-specific class for styling
    document.body.classList.add('about-page');
  }

  componentWillUnmount() {
    // Remove page-specific class
    document.body.classList.remove('about-page');
  }

  render() {
    return (
      <div className="about-page-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row align-items-center min-vh-75">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className="hero-badge">
                    <span className="badge-text">
                      <span role="img" aria-label="rocket">🚀</span> About Us
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Empowering Teams to
                    <span className="gradient-text"> Deliver Excellence</span>
                  </h1>
                  <p className="hero-subtitle">
                    We're passionate about transforming how organizations manage projects, collaborate, and achieve their goals through innovative technology and user-centered design.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">50K+</span>
                      <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">100K+</span>
                      <span className="stat-label">Projects Completed</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">99.9%</span>
                      <span className="stat-label">Uptime</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="about-illustration">
                    <div className="floating-card card-1">
                      <i className="fas fa-users"></i>
                      <span>Team Collaboration</span>
                    </div>
                    <div className="floating-card card-2">
                      <i className="fas fa-chart-line"></i>
                      <span>Analytics</span>
                    </div>
                    <div className="floating-card card-3">
                      <i className="fas fa-shield-alt"></i>
                      <span>Security</span>
                    </div>
                    <div className="main-illustration">
                      <i className="fas fa-project-diagram"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mission-vision-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="mission-card">
                  <div className="card-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h3>Our Mission</h3>
                  <p>
                    To democratize project management by providing enterprise-grade tools that are accessible, intuitive, and powerful enough to handle the most complex organizational challenges.
                  </p>
                  <ul className="mission-points">
                    <li>Simplify complex workflows</li>
                    <li>Enhance team collaboration</li>
                    <li>Drive data-driven decisions</li>
                    <li>Scale with your organization</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="vision-card">
                  <div className="card-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Our Vision</h3>
                  <p>
                    To become the world's most trusted platform for project management, enabling organizations of all sizes to achieve their full potential through seamless collaboration and intelligent insights.
                  </p>
                  <ul className="vision-points">
                    <li>Global accessibility</li>
                    <li>AI-powered insights</li>
                    <li>Seamless integrations</li>
                    <li>Continuous innovation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </div>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h4>User-Centric</h4>
                  <p>Every feature is designed with our users' needs at the forefront, ensuring intuitive and delightful experiences.</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h4>Innovation</h4>
                  <p>We constantly push boundaries to deliver cutting-edge solutions that solve real-world problems.</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <h4>Trust & Security</h4>
                  <p>Your data security and privacy are our top priorities, with enterprise-grade protection measures.</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h4>Collaboration</h4>
                  <p>We believe in the power of teamwork and foster environments where great ideas can flourish.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">
                The passionate individuals behind our success
              </p>
            </div>
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="team-card">
                  <div className="team-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="team-info">
                    <h4>Sarah Johnson</h4>
                    <p className="team-role">CEO & Founder</p>
                    <p className="team-bio">
                      Former tech executive with 15+ years experience in product development and team leadership.
                    </p>
                    <div className="team-social">
                      <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
                      <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="team-card">
                  <div className="team-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="team-info">
                    <h4>Michael Chen</h4>
                    <p className="team-role">CTO</p>
                    <p className="team-bio">
                      Full-stack architect with expertise in scalable systems and emerging technologies.
                    </p>
                    <div className="team-social">
                      <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
                      <a href="#" className="social-link"><i className="fab fa-github"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="team-card">
                  <div className="team-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="team-info">
                    <h4>Emily Rodriguez</h4>
                    <p className="team-role">Head of Design</p>
                    <p className="team-bio">
                      UX/UI expert passionate about creating beautiful, functional, and accessible interfaces.
                    </p>
                    <div className="team-social">
                      <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
                      <a href="#" className="social-link"><i className="fab fa-dribbble"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">
                Key milestones in our company's growth
              </p>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2020 - Foundation</h4>
                  <p>Company founded with a vision to revolutionize project management</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2021 - First Release</h4>
                  <p>Launched MVP with core project management features</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2022 - Growth</h4>
                  <p>Reached 10,000 active users and expanded feature set</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2023 - Enterprise</h4>
                  <p>Launched enterprise features and reached 50,000 users</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2024 - Innovation</h4>
                  <p>AI-powered insights and advanced analytics platform</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content text-center">
              <h2>Ready to Transform Your Project Management?</h2>
              <p>Join thousands of teams already using our platform to achieve their goals.</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <i className="fas fa-rocket me-2"></i>
                  Start Free Trial
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-envelope me-2"></i>
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default About; 