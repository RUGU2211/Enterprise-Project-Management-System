// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we need authentication
    if (window.appHelpers && !window.appHelpers.requireAuth()) return;

    // Check if we're on the dashboard page
    if (window.location.pathname.includes('/views/dashboard/index.html')) {
        loadDashboardData();
        setupDashboardEvents();
    }
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Get user information
        const currentUser = await window.appHelpers.apiRequest('/users/me');
        if (!currentUser) return;

        // Show welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${currentUser.fullName || currentUser.username}!`;
        }

        // Load statistics
        await loadStatistics();

        // Load charts
        await loadCharts();

        // Load recent projects
        await loadRecentProjects();

        // Load assigned issues
        await loadAssignedIssues();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        window.appHelpers.showAlert('Failed to load dashboard data. Please try again later.', 'danger');
    }
}

// Load dashboard statistics
async function loadStatistics() {
    try {
        const stats = await window.appHelpers.apiRequest('/dashboard/stats');
        if (!stats) return;

        // Update statistics
        const totalProjects = document.getElementById('totalProjects');
        if (totalProjects) {
            totalProjects.textContent = stats.totalProjects || 0;
        }

        const openIssues = document.getElementById('openIssues');
        if (openIssues) {
            openIssues.textContent = stats.openIssues || 0;
        }

        const completedIssues = document.getElementById('completedIssues');
        if (completedIssues) {
            completedIssues.textContent = stats.completedIssues || 0;
        }

        const upcomingDeadlines = document.getElementById('upcomingDeadlines');
        if (upcomingDeadlines) {
            upcomingDeadlines.textContent = stats.upcomingDeadlines || 0;
        }

        // Update progress bars
        const projectProgress = document.getElementById('overallProjectProgress');
        if (projectProgress) {
            const percentage = stats.projectCompletionPercentage || 0;
            projectProgress.style.width = `${percentage}%`;
            projectProgress.textContent = `${percentage}%`;
            projectProgress.setAttribute('aria-valuenow', percentage);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Continue loading other parts
    }
}

// Load dashboard charts
async function loadCharts() {
    try {
        const chartData = await window.appHelpers.apiRequest('/dashboard/charts');
        if (!chartData) return;

        // Project completion chart
        const projectCompletionCtx = document.getElementById('projectCompletionChart');
        if (projectCompletionCtx && chartData.projectCompletion) {
            new Chart(projectCompletionCtx, {
                type: 'line',
                data: {
                    labels: chartData.projectCompletion.labels,
                    datasets: [{
                        label: 'Project Completion',
                        data: chartData.projectCompletion.data,
                        fill: false,
                        borderColor: 'rgb(78, 115, 223)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return 'Completion: ' + context.parsed.y + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Issue distribution chart
        const issueDistributionCtx = document.getElementById('issueDistributionChart');
        if (issueDistributionCtx && chartData.issueDistribution) {
            new Chart(issueDistributionCtx, {
                type: 'doughnut',
                data: {
                    labels: chartData.issueDistribution.labels,
                    datasets: [{
                        data: chartData.issueDistribution.data,
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    } catch (error) {
        console.error('Error loading charts:', error);
        // Continue loading other parts
    }
}

// Load recent projects
async function loadRecentProjects() {
    try {
        const projects = await window.appHelpers.apiRequest('/projects?recent=true');
        if (!projects) return;

        const projectsTableBody = document.getElementById('projectsTableBody');
        if (!projectsTableBody) return;

        projectsTableBody.innerHTML = '';

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="../project/details.html?id=${project.id}">${project.name}</a></td>
                <td>${project.lead ? project.lead.fullName : 'Unassigned'}</td>
                <td>${getProjectStatusBadge(project.type)}</td>
                <td>${window.appHelpers.formatDate(project.createdAt)}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar bg-info" role="progressbar" style="width: ${getProjectProgress(project)}%" 
                            aria-valuenow="${getProjectProgress(project)}" aria-valuemin="0" aria-valuemax="100">
                            ${getProjectProgress(project)}%
                        </div>
                    </div>
                </td>
                <td>
                    <a href="../project/details.html?id=${project.id}" class="btn btn-info btn-sm">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            `;

            projectsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent projects:', error);
        // Continue loading other parts
    }
}

// Load assigned issues
async function loadAssignedIssues() {
    try {
        const issues = await window.appHelpers.apiRequest('/issues/assigned');
        if (!issues) return;

        const issuesTableBody = document.getElementById('issuesTableBody');
        if (!issuesTableBody) return;

        issuesTableBody.innerHTML = '';

        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.issueKey}</td>
                <td><a href="../issues/details.html?id=${issue.id}">${issue.title}</a></td>
                <td><a href="../project/details.html?id=${issue.project.id}">${issue.project.name}</a></td>
                <td>${getIssueStatusBadge(issue.status)}</td>
                <td>${getIssuePriorityBadge(issue.priority)}</td>
                <td>
                    <a href="../issues/details.html?id=${issue.id}" class="btn btn-info btn-sm">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            `;

            issuesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading assigned issues:', error);
        // Continue loading other parts
    }
}

// Setup dashboard events
function setupDashboardEvents() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDashboardData();
            window.appHelpers.showAlert('Dashboard refreshed', 'success');
        });
    }
}

// Helper function to get project status badge
function getProjectStatusBadge(type) {
    let badgeClass = 'bg-secondary';
    switch(type) {
        case 'SCRUM':
            badgeClass = 'bg-primary';
            break;
        case 'KANBAN':
            badgeClass = 'bg-info';
            break;
    }
    return `<span class="badge ${badgeClass}">${type}</span>`;
}

// Helper function to get issue status badge
function getIssueStatusBadge(status) {
    let badgeClass = 'bg-secondary';
    let displayText = status;

    switch(status) {
        case 'TODO':
            badgeClass = 'bg-secondary';
            displayText = 'To Do';
            break;
        case 'IN_PROGRESS':
            badgeClass = 'bg-info';
            displayText = 'In Progress';
            break;
        case 'IN_REVIEW':
            badgeClass = 'bg-warning';
            displayText = 'In Review';
            break;
        case 'DONE':
            badgeClass = 'bg-success';
            displayText = 'Done';
            break;
    }

    return `<span class="badge ${badgeClass}">${displayText}</span>`;
}

// Helper function to get issue priority badge
function getIssuePriorityBadge(priority) {
    let badgeClass = 'bg-secondary';

    switch(priority) {
        case 'HIGHEST':
            badgeClass = 'bg-danger';
            break;
        case 'HIGH':
            badgeClass = 'bg-warning';
            break;
        case 'MEDIUM':
            badgeClass = 'bg-info';
            break;
        case 'LOW':
            badgeClass = 'bg-success';
            break;
        case 'LOWEST':
            badgeClass = 'bg-secondary';
            break;
    }

    return `<span class="badge ${badgeClass}">${priority}</span>`;
}

// Helper function to calculate project progress
function getProjectProgress(project) {
    if (!project.issues || project.issues.length === 0) {
        return 0;
    }

    const totalIssues = project.issues.length;
    const completedIssues = project.issues.filter(issue => issue.status === 'DONE').length;

    return Math.round((completedIssues / totalIssues) * 100);
}