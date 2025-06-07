import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getTeamProjectCount } from '../../actions/teamActions';

const TeamProjectCount = ({ teamId, className }) => {
  const [count, setCount] = useState(0);
  
  // Define updateCount as a memoized callback
  const updateCount = useCallback(() => {
    const projectCount = getTeamProjectCount(teamId);
    setCount(projectCount);
  }, [teamId]);
  
  // Define storage change handler as a memoized callback
  const handleStorageChange = useCallback((e) => {
    if (e.key === 'teamProjects') {
      updateCount();
    }
  }, [updateCount]);
  
  useEffect(() => {
    // Initial load
    updateCount();
    
    // Set up an event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [teamId, handleStorageChange, updateCount]);
  
  return (
    <span className={`badge badge-success ${className || ''}`}>
      {count} {count === 1 ? 'Project' : 'Projects'}
    </span>
  );
};

TeamProjectCount.propTypes = {
  teamId: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default TeamProjectCount; 