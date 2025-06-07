import React, { Component } from "react";
import { Link } from "react-router-dom";

class Terms extends Component {
  render() {
    return (
      <div className="terms">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card shadow my-5">
                <div className="card-header bg-white py-3">
                  <h2 className="text-primary font-weight-bold mb-0">Terms of Service</h2>
                </div>
                <div className="card-body p-4">
                  <p className="lead">
                    Welcome to Project Manager! These Terms of Service govern your use of our website and services.
                  </p>
                  
                  <h4 className="mt-4">1. Acceptance of Terms</h4>
                  <p>
                    By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                  </p>
                  
                  <h4 className="mt-4">2. Description of Service</h4>
                  <p>
                    Project Manager provides a web-based platform for project and task management. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
                  </p>
                  
                  <h4 className="mt-4">3. User Accounts</h4>
                  <p>
                    To access certain features of the service, you need to register for an account. You must provide accurate and complete information and keep your account information updated. You are responsible for safeguarding your password and for all activities that occur under your account.
                  </p>
                  
                  <h4 className="mt-4">4. User Content</h4>
                  <p>
                    You retain ownership of any content you submit, post, or display on the service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content for the purpose of providing the service.
                  </p>
                  
                  <h4 className="mt-4">5. Prohibited Activities</h4>
                  <p>
                    You agree not to engage in any of the following activities:
                  </p>
                  <ul>
                    <li>Violating any laws or regulations</li>
                    <li>Impersonating any person or entity</li>
                    <li>Attempting to gain unauthorized access to systems or data</li>
                    <li>Interfering with the proper functioning of the service</li>
                    <li>Using the service for any illegal or unauthorized purpose</li>
                  </ul>
                  
                  <h4 className="mt-4">6. Limitation of Liability</h4>
                  <p>
                    To the maximum extent permitted by law, in no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                  
                  <h4 className="mt-4">7. Changes to Terms</h4>
                  <p>
                    We reserve the right to modify these terms at any time. We will provide notice of any material changes by posting the new Terms on the service. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
                  </p>
                  
                  <h4 className="mt-4">8. Governing Law</h4>
                  <p>
                    These Terms shall be governed by the laws of the state/country where our company is registered, without regard to its conflict of law provisions.
                  </p>
                  
                  <h4 className="mt-4">9. Contact Us</h4>
                  <p>
                    If you have any questions about these Terms, please contact us at support@projectmanager.com.
                  </p>
                  
                  <div className="mt-5">
                    <p className="text-muted">
                      Last updated: May 1, 2023
                    </p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link to="/register" className="btn btn-primary mr-3">
                      <i className="fas fa-user-plus mr-2"></i> Sign Up
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary">
                      <i className="fas fa-sign-in-alt mr-2"></i> Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms; 