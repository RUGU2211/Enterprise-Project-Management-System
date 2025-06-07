import React, { Component } from "react";
import { Link } from "react-router-dom";

class Privacy extends Component {
  render() {
    return (
      <div className="privacy">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card shadow my-5">
                <div className="card-header bg-white py-3">
                  <h2 className="text-primary font-weight-bold mb-0">Privacy Policy</h2>
                </div>
                <div className="card-body p-4">
                  <p className="lead">
                    At Project Manager, we take your privacy seriously. This Privacy Policy describes how we collect, use, and disclose your personal information.
                  </p>
                  
                  <h4 className="mt-4">1. Information We Collect</h4>
                  <p>
                    We collect several types of information from and about users of our service, including:
                  </p>
                  <ul>
                    <li>Personal information such as name, email address, and contact details that you provide when registering</li>
                    <li>Information about your projects and tasks that you create on our platform</li>
                    <li>Usage information and analytics data about how you interact with our service</li>
                    <li>Technical data such as IP address, browser type, and device information</li>
                  </ul>
                  
                  <h4 className="mt-4">2. How We Use Your Information</h4>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul>
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process and complete transactions</li>
                    <li>Send you technical notices, updates, and administrative messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our service</li>
                    <li>Detect, prevent, and address technical issues and fraudulent activities</li>
                  </ul>
                  
                  <h4 className="mt-4">3. Sharing of Information</h4>
                  <p>
                    We may share your personal information with:
                  </p>
                  <ul>
                    <li>Service providers who perform services on our behalf</li>
                    <li>Other users with whom you collaborate on projects (limited to information necessary for collaboration)</li>
                    <li>Legal authorities when required by law or to protect our rights</li>
                  </ul>
                  <p>
                    We will not sell or rent your personal information to third parties for marketing purposes.
                  </p>
                  
                  <h4 className="mt-4">4. Data Security</h4>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, or destruction. However, no Internet transmission is ever fully secure or error-free.
                  </p>
                  
                  <h4 className="mt-4">5. Your Rights</h4>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul>
                    <li>The right to access your personal information</li>
                    <li>The right to rectify inaccurate information</li>
                    <li>The right to erasure of your information</li>
                    <li>The right to restrict processing of your information</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing</li>
                  </ul>
                  
                  <h4 className="mt-4">6. Cookies and Tracking Technologies</h4>
                  <p>
                    We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  </p>
                  
                  <h4 className="mt-4">7. Changes to Our Privacy Policy</h4>
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  
                  <h4 className="mt-4">8. Contact Us</h4>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at privacy@projectmanager.com.
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

export default Privacy; 