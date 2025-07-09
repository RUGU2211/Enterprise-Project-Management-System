import React, { Component } from 'react';
import './Contact.css';

class Contact extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      },
      formErrors: {},
      isSubmitting: false,
      submitSuccess: false
    };
  }

  componentDidMount() {
    document.body.classList.add('contact-page');
  }

  componentWillUnmount() {
    document.body.classList.remove('contact-page');
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      },
      formErrors: {
        ...prevState.formErrors,
        [name]: ''
      }
    }));
  }

  validateForm = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    return errors;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ formErrors: errors });
      return;
    }

    this.setState({ isSubmitting: true });

    // Simulate form submission
    setTimeout(() => {
      this.setState({
        isSubmitting: false,
        submitSuccess: true,
        formData: {
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        }
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.setState({ submitSuccess: false });
      }, 5000);
    }, 2000);
  }

  render() {
    const { formData, formErrors, isSubmitting, submitSuccess } = this.state;

    return (
      <div className="contact-page-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <div className="row align-items-center min-vh-50">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className="hero-badge">
                    <span className="badge-text">
                      <span role="img" aria-label="envelope">📧</span> Get In Touch
                    </span>
                  </div>
                  <h1 className="hero-title">
                    Let's Start a
                    <span className="gradient-text"> Conversation</span>
                  </h1>
                  <p className="hero-subtitle">
                    Have questions about our platform? Need support? Want to discuss a partnership? We'd love to hear from you.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="contact-illustration">
                    <div className="floating-icon icon-1">
                      <i className="fas fa-comments"></i>
                    </div>
                    <div className="floating-icon icon-2">
                      <i className="fas fa-headset"></i>
                    </div>
                    <div className="floating-icon icon-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="main-contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="contact-main-section">
          <div className="container">
            <div className="row g-5">
              {/* Contact Form */}
              <div className="col-lg-8">
                <div className="contact-form-card">
                  <div className="card-header">
                    <h3>Send us a Message</h3>
                    <p>Fill out the form below and we'll get back to you within 24 hours.</p>
                  </div>
                  
                  {submitSuccess && (
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle me-2"></i>
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </div>
                  )}

                  <form onSubmit={this.handleSubmit} className="contact-form">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={this.handleInputChange}
                            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter your full name"
                          />
                          {formErrors.name && (
                            <div className="invalid-feedback">{formErrors.name}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={this.handleInputChange}
                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email address"
                          />
                          {formErrors.email && (
                            <div className="invalid-feedback">{formErrors.email}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="company">Company</label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={this.handleInputChange}
                            className="form-control"
                            placeholder="Enter your company name"
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="subject">Subject *</label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={this.handleInputChange}
                            className={`form-control ${formErrors.subject ? 'is-invalid' : ''}`}
                          >
                            <option value="">Select a subject</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="sales">Sales & Pricing</option>
                            <option value="partnership">Partnership</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                          </select>
                          {formErrors.subject && (
                            <div className="invalid-feedback">{formErrors.subject}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="message">Message *</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={this.handleInputChange}
                            className={`form-control ${formErrors.message ? 'is-invalid' : ''}`}
                            rows="6"
                            placeholder="Tell us more about your inquiry..."
                          ></textarea>
                          {formErrors.message && (
                            <div className="invalid-feedback">{formErrors.message}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-lg-4">
                <div className="contact-info-card">
                  <div className="card-header">
                    <h3>Contact Information</h3>
                    <p>Get in touch with us through any of these channels.</p>
                  </div>
                  
                  <div className="contact-info-list">
                    <div className="contact-info-item">
                      <div className="info-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="info-content">
                        <h5>Office Address</h5>
                        <p>123 Innovation Drive<br />Tech Valley, CA 94000<br />United States</p>
                      </div>
                    </div>
                    
                    <div className="contact-info-item">
                      <div className="info-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="info-content">
                        <h5>Phone Number</h5>
                        <p>+1 (555) 123-4567<br />Mon-Fri, 9AM-6PM PST</p>
                      </div>
                    </div>
                    
                    <div className="contact-info-item">
                      <div className="info-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="info-content">
                        <h5>Email Address</h5>
                        <p>hello@projectmanagement.com<br />support@projectmanagement.com</p>
                      </div>
                    </div>
                    
                    <div className="contact-info-item">
                      <div className="info-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="info-content">
                        <h5>Business Hours</h5>
                        <p>Monday - Friday: 9AM - 6PM PST<br />Saturday: 10AM - 4PM PST<br />Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Support */}
                <div className="quick-support-card">
                  <div className="card-header">
                    <h4>Need Quick Help?</h4>
                  </div>
                  <div className="support-options">
                    <a href="#" className="support-option">
                      <i className="fas fa-book"></i>
                      <span>Documentation</span>
                    </a>
                    <a href="#" className="support-option">
                      <i className="fas fa-video"></i>
                      <span>Video Tutorials</span>
                    </a>
                    <a href="#" className="support-option">
                      <i className="fas fa-question-circle"></i>
                      <span>FAQ</span>
                    </a>
                    <a href="#" className="support-option">
                      <i className="fas fa-comments"></i>
                      <span>Live Chat</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="offices-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Our Global Offices</h2>
              <p className="section-subtitle">
                We have teams around the world to serve you better
              </p>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <div className="office-card">
                  <div className="office-header">
                    <div className="office-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <h4>San Francisco</h4>
                    <p className="office-role">Headquarters</p>
                  </div>
                  <div className="office-details">
                    <p><i className="fas fa-map-marker-alt me-2"></i>123 Innovation Drive, Tech Valley, CA 94000</p>
                    <p><i className="fas fa-phone me-2"></i>+1 (555) 123-4567</p>
                    <p><i className="fas fa-envelope me-2"></i>sf@projectmanagement.com</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="office-card">
                  <div className="office-header">
                    <div className="office-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <h4>New York</h4>
                    <p className="office-role">East Coast Hub</p>
                  </div>
                  <div className="office-details">
                    <p><i className="fas fa-map-marker-alt me-2"></i>456 Business Ave, Manhattan, NY 10001</p>
                    <p><i className="fas fa-phone me-2"></i>+1 (555) 987-6543</p>
                    <p><i className="fas fa-envelope me-2"></i>ny@projectmanagement.com</p>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6">
                <div className="office-card">
                  <div className="office-header">
                    <div className="office-icon">
                      <i className="fas fa-building"></i>
                    </div>
                    <h4>London</h4>
                    <p className="office-role">European Office</p>
                  </div>
                  <div className="office-details">
                    <p><i className="fas fa-map-marker-alt me-2"></i>789 Tech Street, Shoreditch, London EC2A</p>
                    <p><i className="fas fa-phone me-2"></i>+44 20 7123 4567</p>
                    <p><i className="fas fa-envelope me-2"></i>london@projectmanagement.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="faq-item">
                  <h5>How quickly can I get started?</h5>
                  <p>You can start using our platform immediately after signing up. We offer a free trial with full access to all features for 14 days.</p>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="faq-item">
                  <h5>What kind of support do you offer?</h5>
                  <p>We provide 24/7 email support, live chat during business hours, comprehensive documentation, and video tutorials.</p>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="faq-item">
                  <h5>Can I integrate with other tools?</h5>
                  <p>Yes! We offer integrations with popular tools like Slack, GitHub, Jira, and many more through our API and webhooks.</p>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="faq-item">
                  <h5>Is my data secure?</h5>
                  <p>Absolutely. We use enterprise-grade encryption, regular security audits, and comply with industry standards like SOC 2 and GDPR.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Contact; 