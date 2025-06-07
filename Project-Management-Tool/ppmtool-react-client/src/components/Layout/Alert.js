import React from "react";
import PropTypes from "prop-types";

const Alert = ({ message, type }) => {
  let icon, bgClass, textClass, borderClass;

  switch (type) {
    case "success":
      icon = "fa-check-circle";
      bgClass = "alert-success-bg";
      textClass = "text-success";
      borderClass = "border-success";
      break;
    case "danger":
    case "error":
      icon = "fa-exclamation-circle";
      bgClass = "alert-danger-bg";
      textClass = "text-danger";
      borderClass = "border-danger";
      break;
    case "warning":
      icon = "fa-exclamation-triangle";
      bgClass = "alert-warning-bg";
      textClass = "text-warning";
      borderClass = "border-warning";
      break;
    case "info":
    default:
      icon = "fa-info-circle";
      bgClass = "alert-info-bg";
      textClass = "text-info";
      borderClass = "border-info";
  }

  return (
    <div className={`alert-container fade-in-down ${borderClass}`}>
      <div className={`alert-icon ${bgClass}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="alert-content">
        <p className={`alert-text ${textClass}`}>{message}</p>
      </div>
      
      <style jsx>{`
        .alert-container {
          display: flex;
          align-items: center;
          padding: 0;
          margin-bottom: 20px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          background: white;
          border-left: 4px solid;
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          font-size: 1.5rem;
          color: white;
        }
        
        .alert-content {
          flex: 1;
          padding: 15px;
        }
        
        .alert-text {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        /* Background Classes */
        .alert-success-bg {
          background-color: var(--success);
        }
        
        .alert-danger-bg {
          background-color: var(--danger);
        }
        
        .alert-warning-bg {
          background-color: var(--warning);
        }
        
        .alert-info-bg {
          background-color: var(--info);
        }
        
        /* Border Classes */
        .border-success {
          border-color: var(--success);
        }
        
        .border-danger {
          border-color: var(--danger);
        }
        
        .border-warning {
          border-color: var(--warning);
        }
        
        .border-info {
          border-color: var(--info);
        }
        
        /* Text Colors */
        .text-success {
          color: var(--success);
        }
        
        .text-danger {
          color: var(--danger);
        }
        
        .text-warning {
          color: var(--warning);
        }
        
        .text-info {
          color: var(--info);
        }
        
        /* Animation */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default Alert; 