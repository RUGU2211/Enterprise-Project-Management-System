import React from 'react';

const AnimatedCard = ({ children, className = '', size = 'medium', ...props }) => (
  <div className={`animated-card animated-card-${size} ${className}`} {...props}>
    <div className="animated-card-content">{children}</div>
    <style>{`
      .animated-card {
        transition: box-shadow 0.3s, transform 0.3s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border-radius: 1rem;
        background: var(--color-card-bg, #fff);
        position: relative;
      }
      .animated-card:hover {
        box-shadow: 0 8px 24px rgba(0,0,0,0.13);
        transform: translateY(-2px) scale(1.01);
      }
      .animated-card-content {
        color: var(--color-primary, #222);
        position: relative;
        z-index: 1;
        font-weight: 500;
      }
      .animated-card-small {
        padding: 0.5rem 1rem;
        font-size: 0.95rem;
        border-radius: 0.7rem;
      }
      .animated-card-medium {
        padding: 1rem 1.5rem;
        font-size: 1rem;
      }
      .animated-card-large {
        padding: 2rem 2.5rem;
        font-size: 1.15rem;
        border-radius: 1.5rem;
      }
    `}</style>
  </div>
);

export default AnimatedCard; 