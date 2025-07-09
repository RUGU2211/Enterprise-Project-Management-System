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
      <div className="landing-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-particles">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="particle" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 20}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}></div>
              ))}
            </div>
            <div className="hero-gradient"></div>
        </div>
          
          <div className="container">
            <div className="row align-items-center min-vh-100">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className="hero-badge">
                    <span className="badge-text">
                      <span role="img" aria-label="rocket">🚀</span> Enterprise Ready
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Transform Your
                    <span className="gradient-text"> Project Management</span>
                  </h1>
                  <p className="hero-subtitle">
                    Streamline workflows, boost productivity, and deliver exceptional results with our comprehensive project management platform designed for modern teams.
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">10K+</span>
                      <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50K+</span>
                      <span className="stat-label">Projects Completed</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">99.9%</span>
                      <span className="stat-label">Uptime</span>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <Link to="/register" className="btn btn-primary btn-lg">
                      <i className="fas fa-rocket me-2"></i>
                      Start Free Trial
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </Link>
                    <button className="btn btn-link btn-lg play-demo">
                      <i className="fas fa-play me-2"></i>
                      Watch Demo
                    </button>
                  </div>
                      </div>
                    </div>
              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="dashboard-preview">
                    <div className="preview-header">
                      <div className="preview-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="preview-content">
                      <div className="preview-sidebar"></div>
                      <div className="preview-main">
                        <div className="preview-card"></div>
                        <div className="preview-card"></div>
                        <div className="preview-card"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <div className="section-header">
                  <h2 className="section-title">Why Choose Our Platform?</h2>
                  <p className="section-subtitle">
                    Built with modern technologies and designed for scalability
                  </p>
                </div>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-project-diagram"></i>
                  </div>
                  <h3>Advanced Project Management</h3>
                  <p>Create, organize, and track projects with our intuitive interface. Support for multiple methodologies including Agile, Scrum, and Kanban.</p>
                  <ul className="feature-list">
                    <li>Real-time collaboration</li>
                    <li>Custom workflows</li>
                    <li>Progress tracking</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>Team Collaboration</h3>
                  <p>Foster teamwork with built-in communication tools, role management, and real-time updates that keep everyone in sync.</p>
                  <ul className="feature-list">
                    <li>Team dashboards</li>
                    <li>Role-based access</li>
                    <li>Activity feeds</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3>Analytics & Reporting</h3>
                  <p>Make data-driven decisions with comprehensive analytics, custom reports, and performance insights.</p>
                  <ul className="feature-list">
                    <li>Performance metrics</li>
                    <li>Custom reports</li>
                    <li>Export capabilities</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Enterprise Security</h3>
                  <p>Bank-level security with encryption, SSO integration, and compliance with industry standards.</p>
                  <ul className="feature-list">
                    <li>End-to-end encryption</li>
                    <li>SSO integration</li>
                    <li>GDPR compliant</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3>Mobile First</h3>
                  <p>Access your projects anywhere with our responsive design and native mobile applications.</p>
                  <ul className="feature-list">
                    <li>Responsive design</li>
                    <li>Mobile apps</li>
                    <li>Offline support</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-cogs"></i>
                  </div>
                  <h3>Customizable & Scalable</h3>
                  <p>Adapt the platform to your needs with custom fields, integrations, and scalable architecture.</p>
                  <ul className="feature-list">
                    <li>Custom fields</li>
                    <li>API access</li>
                    <li>Third-party integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <div className="section-header">
                  <h2 className="section-title">Trusted by Industry Leaders</h2>
                  <p className="section-subtitle">
                    See what our customers have to say about their experience
                  </p>
                </div>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"This platform transformed how our team collaborates. The intuitive interface and powerful features have increased our productivity by 40%."</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Sarah Johnson</h4>
                      <span>CTO, TechCorp</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"The analytics and reporting features give us insights we never had before. It's like having a business intelligence tool built-in."</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Michael Chen</h4>
                      <span>Project Manager, InnovateLab</span>
              </div>
            </div>
          </div>
        </div>
              
              <div className="col-lg-4">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"Security was our top concern, and this platform exceeded our expectations. The enterprise features are exactly what we needed."</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="author-info">
                      <h4>Emily Rodriguez</h4>
                      <span>IT Director, SecureBank</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2>Ready to Transform Your Project Management?</h2>
                <p>Join thousands of teams already using our platform to deliver better results faster.</p>
                <div className="cta-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Start Your Free Trial
                  </Link>
                  <Link to="/contact" className="btn btn-outline-light btn-lg">
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          .landing-page {
            background: var(--color-bg);
            color: var(--color-text);
            overflow-x: hidden;
          }

          /* Hero Section */
          .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: var(--color-bg);
          }

          .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .hero-particles {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--color-secondary);
            border-radius: 50%;
            animation: float-up linear infinite;
          }

          @keyframes float-up {
            0% {
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) scale(1);
              opacity: 0;
            }
          }

          .hero-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 20%, var(--color-clouded-pearl) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, var(--color-silver-slate) 0%, transparent 50%);
          }

          .hero-content {
            position: relative;
            z-index: 2;
          }

          .hero-badge {
            margin-bottom: 2rem;
          }

          .badge-text {
            background: var(--color-secondary);
            color: var(--color-pure-snow);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-block;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: var(--color-primary);
          }

          .gradient-text {
            background: linear-gradient(135deg, var(--color-silver-slate) 0%, var(--color-clouded-pearl) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-subtitle {
            font-size: 1.25rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .hero-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .stat-item {
            text-align: center;
          }

          .stat-number {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-secondary);
          }

          .stat-label {
            font-size: 0.9rem;
            color: var(--color-text-muted);
          }

          .hero-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .btn {
            padding: 0.75rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }

          .btn-primary {
            background: var(--color-primary);
            color: var(--color-pure-snow);
          }

          .btn-primary:hover {
            background: var(--color-secondary);
            color: var(--color-midnight-mist);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(140,136,137,0.12);
          }

          .btn-outline-light {
            background: transparent;
            color: var(--color-primary);
            border: 2px solid var(--color-secondary);
          }

          .btn-outline-light:hover {
            background: var(--color-clouded-pearl);
            border-color: var(--color-secondary);
          }

          .btn-link {
            background: transparent;
            color: var(--color-text-muted);
            text-decoration: none;
          }

          .btn-link:hover {
            color: var(--color-secondary);
          }

          .hero-visual {
            position: relative;
            z-index: 2;
          }

          .dashboard-preview {
            background: rgba(207,207,211,0.7);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.13);
          }
          [data-theme="dark"] .dashboard-preview {
            background: rgba(140,136,137,0.85);
          }

          .preview-header {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
          }

          .preview-dots {
            display: flex;
            gap: 0.5rem;
          }

          .preview-dots span {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--color-silver-slate);
          }

          .preview-content {
            display: flex;
            height: 300px;
          }

          .preview-sidebar {
            width: 80px;
            background: var(--color-bg-alt);
            border-right: 1px solid var(--color-border);
          }

          .preview-main {
            flex: 1;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .preview-card {
            height: 60px;
            background: var(--color-card-bg);
            border-radius: 10px;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          /* Features Section */
          .features-section {
            padding: 6rem 0;
            background: var(--color-bg-alt);
          }

          .section-header {
            margin-bottom: 4rem;
          }

          .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--color-primary);
          }

          .section-subtitle {
            font-size: 1.1rem;
            color: var(--color-text-muted);
            max-width: 600px;
            margin: 0 auto;
          }
          
          .feature-card {
            background: rgba(255,255,255,0.7);
            border-radius: 20px;
            padding: 2.5rem;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid var(--color-border);
            height: 100%;
            box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          }
          [data-theme="dark"] .feature-card {
            background: rgba(140,136,137,0.85);
            color: var(--color-pure-snow);
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            background: var(--color-clouded-pearl);
            border-color: var(--color-secondary);
          }
          
          .feature-icon {
            width: 80px;
            height: 80px;
            background: var(--color-secondary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            font-size: 2rem;
            color: var(--color-pure-snow);
          }
          
          .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--color-primary);
          }
          [data-theme="dark"] .feature-card h3 {
            color: var(--color-pure-snow);
          }
          
          .feature-card p {
            color: var(--color-text-muted);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          .feature-list {
            list-style: none;
            padding: 0;
            text-align: left;
          }

          .feature-list li {
            color: var(--color-text-muted);
            margin-bottom: 0.5rem;
            position: relative;
            padding-left: 1.5rem;
          }
          
          .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: var(--color-secondary);
            font-weight: bold;
          }

          /* Testimonials Section */
          .testimonials-section {
            padding: 6rem 0;
            background: var(--color-bg);
          }

          .testimonial-card {
            background: rgba(255,255,255,0.7);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid var(--color-border);
            transition: all 0.3s ease;
            box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          }
          [data-theme="dark"] .testimonial-card {
            background: rgba(140,136,137,0.85);
            color: var(--color-pure-snow);
          }

          .testimonial-card:hover {
            transform: translateY(-5px);
            background: var(--color-clouded-pearl);
          }

          .testimonial-content {
            margin-bottom: 1.5rem;
          }

          .testimonial-content p {
            color: var(--color-text-muted);
            font-style: italic;
            line-height: 1.6;
          }

          .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .author-avatar {
            width: 50px;
            height: 50px;
            background: var(--color-secondary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-pure-snow);
          }

          .author-info h4 {
            margin: 0;
            font-size: 1rem;
            color: var(--color-primary);
          }
          [data-theme="dark"] .author-info h4 {
            color: var(--color-pure-snow);
          }

          .author-info span {
            font-size: 0.9rem;
            color: var(--color-text-muted);
          }

          /* CTA Section */
          .cta-section {
            padding: 6rem 0;
            text-align: center;
          }

          .cta-section h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--color-primary);
          }

          .cta-section p {
            font-size: 1.1rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
          }

          .cta-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.5rem;
            }

            .hero-stats {
              flex-direction: column;
              gap: 1rem;
            }

            .hero-actions {
              flex-direction: column;
            }

            .section-title {
              font-size: 2rem;
            }

            .feature-card {
              padding: 2rem;
            }

            .cta-actions {
              flex-direction: column;
              align-items: center;
            }
          }

          @media (max-width: 576px) {
            .hero-title {
              font-size: 2rem;
            }

            .hero-subtitle {
              font-size: 1rem;
            }

            .section-title {
              font-size: 1.75rem;
            }

            .feature-card {
              padding: 1.5rem;
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
