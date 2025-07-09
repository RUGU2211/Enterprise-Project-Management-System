import React from 'react';

const EnhancedSpinner = ({ text = 'Loading...', size = '2rem', variant = 'primary' }) => (
  <div className="enhanced-spinner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
    <div className={`spinner-border text-${variant}`} style={{ width: size, height: size }} role="status">
      <span className="sr-only">Loading...</span>
    </div>
    <div style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>{text}</div>
    <style>{`
      .enhanced-spinner .spinner-border {
        border-width: 0.25em;
      }
    `}</style>
  </div>
);

export default EnhancedSpinner; 