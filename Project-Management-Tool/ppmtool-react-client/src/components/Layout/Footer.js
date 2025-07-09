import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer-glass mt-auto py-4">
    <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="footer-brand d-flex align-items-center mb-3 mb-md-0">
        <span className="footer-logo me-2"><i className="fas fa-project-diagram"></i></span>
        <span className="footer-title heading-college">Project Management Tool</span>
      </div>
      <div className="footer-links mb-3 mb-md-0">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/about" className="footer-link">About</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
        <Link to="/privacy" className="footer-link">Privacy</Link>
      </div>
      <div className="footer-copyright text-muted">
        &copy; {new Date().getFullYear()} Project Management Tool. All rights reserved.
      </div>
    </div>
    <style>{`
      .footer-glass {
        background: rgba(233,236,239,0.55);
        color: var(--color-primary);
        box-shadow: 0 -4px 32px 0 rgba(26,58,142,0.10);
        backdrop-filter: blur(18px);
        border-radius: 1.5em 1.5em 0 0;
        border-top: 1.5px solid var(--midnight-mist);
        margin-top: 2em;
        font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
        transition: background 0.3s, color 0.3s, border 0.3s;
      }
      .footer-brand .footer-logo {
        font-size: 1.5rem;
        color: var(--midnight-mist);
        background: var(--clouded-pearl);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5em;
        box-shadow: 0 2px 8px 0 rgba(26,58,142,0.07);
        border: 1.5px solid var(--silver-slate);
      }
      .footer-title {
        font-size: 1.1rem;
        font-weight: 900;
        color: var(--midnight-mist);
      }
      .footer-links {
        display: flex;
        gap: 1.5em;
      }
      .footer-link {
        color: var(--midnight-mist);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s;
        font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;
        border-radius: 1em;
        padding: 0.3em 1em;
      }
      .footer-link:hover {
        color: var(--color-primary);
        background: rgba(26,58,142,0.08);
        text-decoration: underline;
      }
      .footer-copyright {
        font-size: 0.95rem;
        color: var(--color-text-muted);
      }
      @media (max-width: 768px) {
        .footer-glass .container {
          flex-direction: column !important;
          text-align: center;
        }
        .footer-links {
          justify-content: center;
          margin-bottom: 1em;
        }
      }
    `}</style>
  </footer>
);

export default Footer; 