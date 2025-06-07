import React, { Component } from "react";
import ProjectItem from "./Project/ProjectItem";
import CreateProjectButton from "./Project/CreateProjectButton";
import { connect } from "react-redux";
import { getProjects } from "../actions/projectActions";
import PropTypes from "prop-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      totalProjects: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      totalTasks: 0,
      projectProgress: [],
      taskDistribution: []
    };
  }

  componentDidMount() {
    this.props.getProjects();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.project.projects !== this.props.project.projects) {
      this.calculateAnalytics();
    }
  }

  calculateAnalytics() {
    const { projects } = this.props.project;
    
    let totalCompletedTasks = 0;
    let totalPendingTasks = 0;
    let totalInProgressTasks = 0;
    let totalTasksCount = 0;
    
    const projectProgress = [];
    
    if (projects) {
      projects.forEach(project => {
        let projectCompletedTasks = 0;
        let projectTotalTasks = 0;
        
        // If project has backlog and backlog has tasks
        if (project.backlog && project.backlog.projectTasks) {
          const tasks = project.backlog.projectTasks;
          projectTotalTasks = tasks.length;
          
          tasks.forEach(task => {
            if (task.status === "DONE") {
              projectCompletedTasks++;
              totalCompletedTasks++;
            } else if (task.status === "IN_PROGRESS") {
              totalInProgressTasks++;
            } else {
              totalPendingTasks++;
            }
          });
          
          totalTasksCount += projectTotalTasks;
        }
        
        // Calculate project progress percentage
        const progressPercentage = projectTotalTasks > 0 
          ? Math.round((projectCompletedTasks / projectTotalTasks) * 100) 
          : 0;
        
        projectProgress.push({
          name: project.projectName,
          progress: progressPercentage
        });
      });
    }
    
    // Prepare task distribution data for pie chart
    const taskDistribution = [
      { name: 'Completed', value: totalCompletedTasks, color: '#4CAF50' },
      { name: 'In Progress', value: totalInProgressTasks, color: '#2196F3' },
      { name: 'To Do', value: totalPendingTasks, color: '#F44336' }
    ];
    
    this.setState({
      totalProjects: projects ? projects.length : 0,
      completedTasks: totalCompletedTasks,
      pendingTasks: totalPendingTasks,
      inProgressTasks: totalInProgressTasks,
      totalTasks: totalTasksCount,
      projectProgress,
      taskDistribution
    });
  }

  render() {
    const { projects } = this.props.project;
    const { 
      totalProjects, 
      completedTasks, 
      pendingTasks, 
      inProgressTasks, 
      totalTasks,
      projectProgress,
      taskDistribution
    } = this.state;
    
    const projectItems = projects.map(project => (
      <ProjectItem key={project.id} project={project} />
    ));

    const dashboardContent = (
      <div>
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4>Dashboard Analytics</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="card bg-light mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Total Projects</h5>
                        <h2 className="display-4">{totalProjects}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-success text-white mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Completed Tasks</h5>
                        <h2 className="display-4">{completedTasks}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-info text-white mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">In Progress</h5>
                        <h2 className="display-4">{inProgressTasks}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-danger text-white mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">Pending Tasks</h5>
                        <h2 className="display-4">{pendingTasks}</h2>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h5 className="mb-3">Project Progress</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={projectProgress}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="progress" fill="#8884d8" name="Completion %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3">Task Distribution</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={taskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CreateProjectButton />
        
        <div className="row">
          <div className="col-md-12">
            <h4 className="mb-4">Projects</h4>
            {projectItems}
          </div>
        </div>
      </div>
    );

    return (
      <div className="projects">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  project: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  { getProjects }
)(Dashboard); 