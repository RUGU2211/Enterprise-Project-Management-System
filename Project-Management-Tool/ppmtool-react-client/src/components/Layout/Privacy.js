import React, { Component } from 'react';
import './Privacy.css';

class Privacy extends Component {
  componentDidMount() {
    document.body.classList.add('privacy-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('privacy-page');
  }

  render() {
    return (
      <div className="privacy-page-container">
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="container">
            <div className="row align-items-center min-vh-50">
              <div className="col-lg-8 mx-auto text-center">
                <div className="hero-content">
                  <div className="hero-badge">
                    <span className="badge-text">
                      <span role="img" aria-label="shield">🛡️</span> Privacy Policy
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Your Privacy is Our
                    <span className="gradient-text"> Priority</span>
                  </h1>
                  <p className="hero-subtitle">
                    We are committed to protecting your personal information and ensuring transparency in how we collect, use, and safeguard your data.
                  </p>
                  <div className="privacy-stats">
                    <div className="stat-item">
                      <span className="stat-number">100%</span>
                      <span className="stat-label">Data Encryption</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">GDPR</span>
                      <span className="stat-label">Compliant</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">24/7</span>
                      <span className="stat-label">Security Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="toc-section">
          <div className="container">
            <div className="toc-card">
              <h3>Table of Contents</h3>
              <div className="toc-links">
                <a href="#information-collection" className="toc-link">
                  <i className="fas fa-database"></i>
                  Information We Collect
                </a>
                <a href="#data-usage" className="toc-link">
                  <i className="fas fa-chart-line"></i>
                  How We Use Your Data
                </a>
                <a href="#data-sharing" className="toc-link">
                  <i className="fas fa-share-alt"></i>
                  Data Sharing & Disclosure
                </a>
                <a href="#data-security" className="toc-link">
                  <i className="fas fa-shield-alt"></i>
                  Data Security
                </a>
                <a href="#your-rights" className="toc-link">
                  <i className="fas fa-user-check"></i>
                  Your Rights
                </a>
                <a href="#cookies" className="toc-link">
                  <i className="fas fa-cookie-bite"></i>
                  Cookies & Tracking
                </a>
                <a href="#children" className="toc-link">
                  <i className="fas fa-baby"></i>
                  Children's Privacy
                </a>
                <a href="#international" className="toc-link">
                  <i className="fas fa-globe"></i>
                  International Transfers
                </a>
                <a href="#changes" className="toc-link">
                  <i className="fas fa-edit"></i>
                  Policy Changes
                </a>
                <a href="#contact" className="toc-link">
                  <i className="fas fa-envelope"></i>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="privacy-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                
                {/* Information Collection */}
                <div id="information-collection" className="privacy-section">
                  <div className="section-header">
                    <h2>Information We Collect</h2>
                    <p>We collect information to provide better services to our users and improve our platform.</p>
                  </div>
                  
                  <div className="content-card">
                    <h4>Personal Information</h4>
                    <p>When you create an account or use our services, we may collect:</p>
                    <ul>
                      <li><strong>Account Information:</strong> Name, email address, company name, and job title</li>
                      <li><strong>Profile Information:</strong> Profile picture, bio, and preferences</li>
                      <li><strong>Contact Information:</strong> Phone number and mailing address (if provided)</li>
                      <li><strong>Payment Information:</strong> Billing details and payment method (processed securely by third-party providers)</li>
                    </ul>
                    
                    <h4>Usage Information</h4>
                    <p>We automatically collect information about how you use our platform:</p>
                    <ul>
                      <li><strong>Activity Data:</strong> Projects created, tasks completed, and team interactions</li>
                      <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                      <li><strong>Log Data:</strong> Access times, pages viewed, and features used</li>
                      <li><strong>Performance Data:</strong> App crashes, loading times, and error reports</li>
                    </ul>
                  </div>
                </div>

                {/* Data Usage */}
                <div id="data-usage" className="privacy-section">
                  <div className="section-header">
                    <h2>How We Use Your Data</h2>
                    <p>We use your information to provide, improve, and personalize our services.</p>
                  </div>
                  
                  <div className="content-card">
                    <div className="usage-grid">
                      <div className="usage-item">
                        <div className="usage-icon">
                          <i className="fas fa-cogs"></i>
                        </div>
                        <h5>Service Provision</h5>
                        <p>To provide and maintain our project management platform, process transactions, and deliver customer support.</p>
                      </div>
                      
                      <div className="usage-item">
                        <div className="usage-icon">
                          <i className="fas fa-chart-bar"></i>
                        </div>
                        <h5>Analytics & Improvement</h5>
                        <p>To analyze usage patterns, improve our services, and develop new features based on user needs.</p>
                      </div>
                      
                      <div className="usage-item">
                        <div className="usage-icon">
                          <i className="fas fa-bullhorn"></i>
                        </div>
                        <h5>Communication</h5>
                        <p>To send important updates, security alerts, and respond to your requests and inquiries.</p>
                      </div>
                      
                      <div className="usage-item">
                        <div className="usage-icon">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <h5>Security & Compliance</h5>
                        <p>To detect and prevent fraud, abuse, and security threats, and ensure compliance with legal obligations.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Sharing */}
                <div id="data-sharing" className="privacy-section">
                  <div className="section-header">
                    <h2>Data Sharing & Disclosure</h2>
                    <p>We are committed to protecting your privacy and only share your data in limited circumstances.</p>
                  </div>
                  
                  <div className="content-card">
                    <h4>We Do Not Sell Your Data</h4>
                    <p>We never sell, rent, or trade your personal information to third parties for marketing purposes.</p>
                    
                    <h4>Limited Sharing</h4>
                    <p>We may share your information only in the following situations:</p>
                    <ul>
                      <li><strong>Service Providers:</strong> With trusted third-party vendors who help us operate our platform (e.g., cloud hosting, payment processing)</li>
                      <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                      <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with appropriate safeguards)</li>
                      <li><strong>Safety & Security:</strong> To protect our users, prevent fraud, or address security threats</li>
                      <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                    </ul>
                    
                    <div className="warning-box">
                      <i className="fas fa-exclamation-triangle"></i>
                      <div>
                        <h5>Data Protection Commitment</h5>
                        <p>All third-party service providers are carefully vetted and required to maintain the same level of data protection as we do.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Security */}
                <div id="data-security" className="privacy-section">
                  <div className="section-header">
                    <h2>Data Security</h2>
                    <p>We implement industry-leading security measures to protect your information.</p>
                  </div>
                  
                  <div className="content-card">
                    <div className="security-features">
                      <div className="security-item">
                        <div className="security-icon">
                          <i className="fas fa-lock"></i>
                        </div>
                        <div className="security-content">
                          <h5>End-to-End Encryption</h5>
                          <p>All data is encrypted in transit and at rest using AES-256 encryption standards.</p>
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="security-icon">
                          <i className="fas fa-server"></i>
                        </div>
                        <div className="security-content">
                          <h5>Secure Infrastructure</h5>
                          <p>Our servers are hosted in SOC 2 Type II certified data centers with 24/7 monitoring.</p>
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="security-icon">
                          <i className="fas fa-user-shield"></i>
                        </div>
                        <div className="security-content">
                          <h5>Access Controls</h5>
                          <p>Strict access controls and authentication mechanisms protect your data from unauthorized access.</p>
                        </div>
                      </div>
                      
                      <div className="security-item">
                        <div className="security-icon">
                          <i className="fas fa-sync-alt"></i>
                        </div>
                        <div className="security-content">
                          <h5>Regular Backups</h5>
                          <p>Automated daily backups ensure your data is safe and recoverable in case of any issues.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Rights */}
                <div id="your-rights" className="privacy-section">
                  <div className="section-header">
                    <h2>Your Rights</h2>
                    <p>You have control over your personal information and several rights regarding your data.</p>
                  </div>
                  
                  <div className="content-card">
                    <div className="rights-grid">
                      <div className="right-item">
                        <h5><i className="fas fa-eye"></i> Right to Access</h5>
                        <p>Request a copy of the personal information we hold about you.</p>
                      </div>
                      
                      <div className="right-item">
                        <h5><i className="fas fa-edit"></i> Right to Rectification</h5>
                        <p>Correct inaccurate or incomplete personal information.</p>
                      </div>
                      
                      <div className="right-item">
                        <h5><i className="fas fa-trash"></i> Right to Erasure</h5>
                        <p>Request deletion of your personal information in certain circumstances.</p>
                      </div>
                      
                      <div className="right-item">
                        <h5><i className="fas fa-pause"></i> Right to Restriction</h5>
                        <p>Limit how we process your personal information.</p>
                      </div>
                      
                      <div className="right-item">
                        <h5><i className="fas fa-download"></i> Right to Portability</h5>
                        <p>Receive your data in a structured, machine-readable format.</p>
                      </div>
                      
                      <div className="right-item">
                        <h5><i className="fas fa-ban"></i> Right to Object</h5>
                        <p>Object to processing of your personal information for certain purposes.</p>
                      </div>
                    </div>
                    
                    <div className="contact-info-box">
                      <h5>Exercise Your Rights</h5>
                      <p>To exercise any of these rights, please contact us at:</p>
                      <div className="contact-details">
                        <p><i className="fas fa-envelope"></i> privacy@projectmanagement.com</p>
                        <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
                        <p><i className="fas fa-map-marker-alt"></i> 123 Innovation Drive, Tech Valley, CA 94000</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies */}
                <div id="cookies" className="privacy-section">
                  <div className="section-header">
                    <h2>Cookies & Tracking Technologies</h2>
                    <p>We use cookies and similar technologies to enhance your experience and analyze usage.</p>
                  </div>
                  
                  <div className="content-card">
                    <h4>Types of Cookies We Use</h4>
                    
                    <div className="cookie-types">
                      <div className="cookie-type">
                        <h5>Essential Cookies</h5>
                        <p>Required for basic functionality and security. These cannot be disabled.</p>
                        <span className="cookie-tag">Always Active</span>
                      </div>
                      
                      <div className="cookie-type">
                        <h5>Functional Cookies</h5>
                        <p>Remember your preferences and settings to improve your experience.</p>
                        <span className="cookie-tag">Recommended</span>
                      </div>
                      
                      <div className="cookie-type">
                        <h5>Analytics Cookies</h5>
                        <p>Help us understand how visitors interact with our platform.</p>
                        <span className="cookie-tag">Optional</span>
                      </div>
                      
                      <div className="cookie-type">
                        <h5>Marketing Cookies</h5>
                        <p>Used to deliver relevant advertisements and measure campaign effectiveness.</p>
                        <span className="cookie-tag">Optional</span>
                      </div>
                    </div>
                    
                    <div className="cookie-controls">
                      <h5>Cookie Preferences</h5>
                      <p>You can manage your cookie preferences through your browser settings or our cookie consent tool.</p>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-cog"></i>
                        Manage Cookie Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* Children's Privacy */}
                <div id="children" className="privacy-section">
                  <div className="section-header">
                    <h2>Children's Privacy</h2>
                    <p>We are committed to protecting the privacy of children and young users.</p>
                  </div>
                  
                  <div className="content-card">
                    <div className="children-info">
                      <div className="age-requirement">
                        <i className="fas fa-birthday-cake"></i>
                        <div>
                          <h5>Age Requirement</h5>
                          <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
                        </div>
                      </div>
                      
                      <div className="parental-consent">
                        <i className="fas fa-user-friends"></i>
                        <div>
                          <h5>Parental Consent</h5>
                          <p>If you are under 18, you must have parental or guardian consent to use our services. Parents can review, delete, or refuse further collection of their child's information.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Transfers */}
                <div id="international" className="privacy-section">
                  <div className="section-header">
                    <h2>International Data Transfers</h2>
                    <p>Your data may be transferred and processed in countries other than your own.</p>
                  </div>
                  
                  <div className="content-card">
                    <h4>Global Operations</h4>
                    <p>We operate globally and may transfer your information to countries outside your residence. We ensure appropriate safeguards are in place:</p>
                    
                    <div className="safeguards-list">
                      <div className="safeguard-item">
                        <i className="fas fa-check-circle"></i>
                        <span>Standard Contractual Clauses (SCCs) approved by the European Commission</span>
                      </div>
                      <div className="safeguard-item">
                        <i className="fas fa-check-circle"></i>
                        <span>Adequacy decisions for countries with equivalent data protection standards</span>
                      </div>
                      <div className="safeguard-item">
                        <i className="fas fa-check-circle"></i>
                        <span>Certification schemes and codes of conduct</span>
                      </div>
                    </div>
                    
                    <div className="info-box">
                      <i className="fas fa-info-circle"></i>
                      <div>
                        <h5>Data Protection Standards</h5>
                        <p>Regardless of where your data is processed, we maintain the same high standards of data protection and security.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Changes */}
                <div id="changes" className="privacy-section">
                  <div className="section-header">
                    <h2>Changes to This Policy</h2>
                    <p>We may update this privacy policy from time to time to reflect changes in our practices or legal requirements.</p>
                  </div>
                  
                  <div className="content-card">
                    <h4>Notification of Changes</h4>
                    <p>When we make material changes to this policy, we will:</p>
                    <ul>
                      <li>Notify you via email or in-app notification at least 30 days before the changes take effect</li>
                      <li>Update the "Last Updated" date at the top of this policy</li>
                      <li>Provide a summary of the key changes made</li>
                      <li>Give you the opportunity to review and accept the changes</li>
                    </ul>
                    
                    <div className="last-updated">
                      <h5>Last Updated</h5>
                      <p>This privacy policy was last updated on <strong>January 15, 2024</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div id="contact" className="privacy-section">
                  <div className="section-header">
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our data practices, please contact us.</p>
                  </div>
                  
                  <div className="content-card">
                    <div className="contact-methods">
                      <div className="contact-method">
                        <div className="method-icon">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div className="method-content">
                          <h5>Email</h5>
                          <p>privacy@projectmanagement.com</p>
                          <small>For privacy-related inquiries and data requests</small>
                        </div>
                      </div>
                      
                      <div className="contact-method">
                        <div className="method-icon">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div className="method-content">
                          <h5>Phone</h5>
                          <p>+1 (555) 123-4567</p>
                          <small>Available Monday-Friday, 9AM-6PM PST</small>
                        </div>
                      </div>
                      
                      <div className="contact-method">
                        <div className="method-icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="method-content">
                          <h5>Mail</h5>
                          <p>Privacy Officer<br />123 Innovation Drive<br />Tech Valley, CA 94000</p>
                          <small>For formal privacy complaints and legal matters</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="response-time">
                      <h5>Response Time</h5>
                      <p>We aim to respond to all privacy-related inquiries within <strong>48 hours</strong> during business days.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Privacy; 