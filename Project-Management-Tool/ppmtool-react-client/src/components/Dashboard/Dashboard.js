import React, { Component } from 'react';

class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard-welcome-container">
        <div className="dashboard-welcome-message">
          <h1>Welcome to the Project Management System!</h1>
          <p>Manage your projects, teams, and tasks efficiently.</p>
        </div>
        <style>{`
          .dashboard-welcome-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }
          .dashboard-welcome-message {
            background: var(--color-card-bg, #fff);
            border-radius: 1.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            padding: 3rem 2.5rem;
            text-align: center;
          }
          .dashboard-welcome-message h1 {
            color: var(--color-primary, #222);
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          .dashboard-welcome-message p {
            color: var(--color-text-muted, #555);
            font-size: 1.15rem;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }
}

export default Dashboard; 