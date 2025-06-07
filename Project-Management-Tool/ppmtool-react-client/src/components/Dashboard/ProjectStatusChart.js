import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

const ProjectStatusChart = ({ projects }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // Count projects by status
    const statusCounts = {
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0,
      'Delayed': 0
    };

    const now = new Date();

    projects.forEach(project => {
      const startDate = project.start_date ? new Date(project.start_date) : null;
      const endDate = project.end_date ? new Date(project.end_date) : null;

      // Determine project status
      if (!startDate) {
        statusCounts['Not Started']++;
      } else if (endDate && now > endDate) {
        // Check if project has tasks still in progress
        const hasPendingTasks = project.backlog && 
          project.backlog.projectTasks && 
          project.backlog.projectTasks.some(task => 
            task.status !== 'DONE'
          );
        
        if (hasPendingTasks) {
          statusCounts['Delayed']++;
        } else {
          statusCounts['Completed']++;
        }
      } else if (startDate && startDate <= now) {
        statusCounts['In Progress']++;
      } else {
        statusCounts['Not Started']++;
      }
    });

    // Chart colors
    const chartColors = {
      'Not Started': '#4e73df',
      'In Progress': '#36b9cc',
      'Completed': '#1cc88a',
      'Delayed': '#f6c23e'
    };

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: Object.keys(statusCounts).map(status => chartColors[status]),
          hoverBackgroundColor: Object.keys(statusCounts).map(status => chartColors[status]),
          hoverBorderColor: 'rgba(234, 236, 244, 1)',
        }],
      },
      options: {
        maintainAspectRatio: false,
        cutoutPercentage: 70,
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltips: {
          titleFontSize: 14,
          bodyFontSize: 14,
          callbacks: {
            label: function(tooltipItem, data) {
              const label = data.labels[tooltipItem.index] || '';
              const value = data.datasets[0].data[tooltipItem.index];
              const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [projects]);

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-5">
        <i className="fas fa-chart-pie fa-3x text-light mb-3"></i>
        <h5 className="font-weight-bold text-gray-800">No Project Data</h5>
        <p className="text-muted">Create projects to see status distribution</p>
      </div>
    );
  }

  return (
    <div>
      <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      <div className="row mt-4">
        {Object.entries({
          'Not Started': { color: '#4e73df', icon: 'clock' },
          'In Progress': { color: '#36b9cc', icon: 'spinner' },
          'Completed': { color: '#1cc88a', icon: 'check-circle' },
          'Delayed': { color: '#f6c23e', icon: 'exclamation-triangle' }
        }).map(([status, { color, icon }]) => (
          <div className="col-6 col-md-3 mb-3" key={status}>
            <div className="d-flex align-items-center">
              <div 
                className="status-indicator mr-2"
                style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: color 
                }}
              ></div>
              <div>
                <div className="d-flex align-items-center">
                  <i className={`fas fa-${icon} mr-1`} style={{ color }}></i>
                  <span className="small font-weight-bold">{status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ProjectStatusChart.propTypes = {
  projects: PropTypes.array.isRequired
};

export default ProjectStatusChart; 