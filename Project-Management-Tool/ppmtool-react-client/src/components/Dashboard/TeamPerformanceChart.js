import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

const TeamPerformanceChart = ({ teams, projects }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Process data for the chart
    if (!teams || !Array.isArray(teams) || teams.length === 0 || !projects || projects.length === 0) {
      setChartData(null);
      return;
    }

    // Calculate team metrics
    const teamMetrics = teams.map(team => {
      // Find projects associated with this team
      const teamProjects = projects.filter(project => 
        project.teamId === team.id || 
        project.projectTeam === team.id ||
        project.team === team.id
      );
      
      // Calculate task counts by status
      let completedTasks = 0;
      let inProgressTasks = 0;
      let todoTasks = 0;
      
      teamProjects.forEach(project => {
        if (project.backlog && project.backlog.projectTasks) {
          project.backlog.projectTasks.forEach(task => {
            if (task.status === 'DONE') {
              completedTasks++;
            } else if (task.status === 'IN_PROGRESS') {
              inProgressTasks++;
            } else {
              todoTasks++;
            }
          });
        }
      });
      
      const totalTasks = completedTasks + inProgressTasks + todoTasks;
      
      // Calculate productivity ratio (completed tasks / total tasks)
      const productivity = totalTasks > 0 ? 
        (completedTasks / totalTasks) * 100 : 0;
      
      // Calculate efficiency score (weighted metric)
      // Higher weight for completed tasks, lower for in progress
      const efficiencyScore = totalTasks > 0 ?
        ((completedTasks * 1.5) + (inProgressTasks * 0.5)) / totalTasks * 100 : 0;

      return {
        teamName: team.teamName,
        completedTasks,
        inProgressTasks,
        todoTasks,
        totalTasks,
        productivity: parseFloat(productivity.toFixed(2)),
        efficiencyScore: parseFloat(efficiencyScore.toFixed(2))
      };
    });

    // Sort teams by productivity for better visualization
    teamMetrics.sort((a, b) => b.productivity - a.productivity);
    
    // Prepare data for chart
    setChartData({
      labels: teamMetrics.map(team => team.teamName),
      datasets: [
        {
          label: 'Productivity (%)',
          data: teamMetrics.map(team => team.productivity),
          backgroundColor: 'rgba(78, 115, 223, 0.8)',
          borderColor: 'rgba(78, 115, 223, 1)',
          borderWidth: 1
        },
        {
          label: 'Efficiency Score',
          data: teamMetrics.map(team => team.efficiencyScore),
          backgroundColor: 'rgba(28, 200, 138, 0.8)',
          borderColor: 'rgba(28, 200, 138, 1)',
          borderWidth: 1
        }
      ],
      teamDetails: teamMetrics
    });
  }, [teams, projects]);

  useEffect(() => {
    // Create or update chart when data changes
    if (!chartData) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 100
            },
            scaleLabel: {
              display: true,
              labelString: 'Performance Metrics (%)'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Teams'
            }
          }]
        },
        legend: {
          position: 'top',
        },
        tooltips: {
          callbacks: {
            afterBody: function(tooltipItems, data) {
              const index = tooltipItems[0].index;
              const teamData = chartData.teamDetails[index];
              return [
                `Total Tasks: ${teamData.totalTasks}`,
                `Completed: ${teamData.completedTasks}`,
                `In Progress: ${teamData.inProgressTasks}`,
                `To Do: ${teamData.todoTasks}`
              ];
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
  }, [chartData]);

  if (!teams || teams.length === 0 || !projects || projects.length === 0) {
    return (
      <div className="text-center p-5">
        <i className="fas fa-users fa-3x text-light mb-3"></i>
        <h5 className="font-weight-bold text-gray-800">No Team Data Available</h5>
        <p className="text-muted">Create teams and assign projects to view performance</p>
      </div>
    );
  }

  return (
    <div>
      <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      {chartData && chartData.teamDetails && (
        <div className="table-responsive mt-4">
          <table className="table table-sm">
            <thead className="thead-light">
              <tr>
                <th>Team</th>
                <th>Tasks</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Productivity</th>
              </tr>
            </thead>
            <tbody>
              {chartData.teamDetails.map((team, index) => (
                <tr key={index}>
                  <td className="font-weight-bold">{team.teamName}</td>
                  <td>{team.totalTasks}</td>
                  <td>
                    <span className="badge bg-success text-white">
                      {team.completedTasks}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-primary text-white">
                      {team.inProgressTasks}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 mr-2" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{ width: `${team.productivity}%` }}
                        ></div>
                      </div>
                      <span>{team.productivity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

TeamPerformanceChart.propTypes = {
  teams: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired
};

export default TeamPerformanceChart; 