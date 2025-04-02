// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard script loaded");

    // Check if components are loaded correctly
    const headerLoaded = document.getElementById('header-placeholder').innerHTML !== '';
    const sidebarLoaded = document.getElementById('sidebar-placeholder').innerHTML !== '';

    if (!headerLoaded || !sidebarLoaded) {
        console.log("Components not fully loaded, waiting 500ms to retry");
        setTimeout(() => {
            if (!document.getElementById('header-placeholder').innerHTML ||
                !document.getElementById('sidebar-placeholder').innerHTML) {
                console.log("Components still not loaded, reloading them");
                if (window.loadComponents) {
                    window.loadComponents();
                }
            }
        }, 500);
    }

    // Check if we need authentication
    if (window.appHelpers) {
        console.log("App helpers found, checking authentication");
        // Don't return immediately, proceed anyway but check auth status
        window.appHelpers.requireAuth();

        // Check if we're on the dashboard page
        if (window.location.pathname.includes('/views/dashboard/index.html')) {
            console.log("On dashboard page, loading dashboard data");
            loadDashboardData();
            setupDashboardEvents();
        } else {
            console.log("Not on dashboard page: " + window.location.pathname);
        }
    } else {
        console.error("App helpers not found, cannot proceed with dashboard initialization");
        showFallbackContent("App initialization failed. Please try refreshing the page.");
    }
});

// Show fallback content when things fail
function showFallbackContent(message) {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="alert alert-warning m-3">
                <h4 class="alert-heading">Dashboard Error</h4>
                <p>${message}</p>
                <hr>
                <p class="mb-0">
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt me-1"></i> Refresh Page
                    </button>
                </p>
            </div>
        `;
    }
}

// Load dashboard data
async function loadDashboardData() {
    console.log("Loading dashboard data...");

    try {
        // Get user information
        console.log("Fetching user information");
        const currentUser = await fetchWithFallback('/users/me', { fullName: 'User', username: 'user' });

        // Show welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            console.log("Updating welcome message");
            welcomeMessage.textContent = `Welcome back, ${currentUser.fullName || currentUser.username}!`;
        }

        // Load all dashboard sections in parallel
        console.log("Loading dashboard sections in parallel");
        const results = await Promise.allSettled([
            loadStatistics(),
            loadCharts(),
            loadRecentProjects(),
            loadAssignedIssues()
        ]);

        // Check for any rejected promises
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Error in dashboard section ${index}:`, result.reason);
            }
        });

        console.log("Dashboard data loading complete");
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        window.appHelpers?.showAlert('Failed to load dashboard data. Please try again later.', 'danger') ||
        showFallbackContent('Failed to load dashboard data: ' + error.message);
    }
}

// Helper function to fetch with fallback for testing
async function fetchWithFallback(endpoint, fallbackData) {
    try {
        if (window.appHelpers?.apiRequest) {
            const response = await window.appHelpers.apiRequest(endpoint);
            return response || fallbackData;
        }

        // Try a direct fetch with session credentials as fallback
        console.log(`Trying direct fetch for ${endpoint}`);
        const response = await fetch(`/epm/api${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }

        console.log(`API request to ${endpoint} failed, using fallback data`);
        return fallbackData;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return fallbackData;
    }
}

// Load dashboard statistics
async function loadStatistics() {
    console.log("Loading dashboard statistics");

    // Fallback stats data for testing if API fails
    const fallbackStats = {
        totalProjects: 0,
        openIssues: 0,
        completedIssues: 0,
        upcomingDeadlines: 0,
        projectCompletionPercentage: 0
    };

    const stats = await fetchWithFallback('/dashboard/stats', fallbackStats);
    console.log("Statistics loaded:", stats);

    // Update statistics
    const updateElementText = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || 0;
        }
    };

    updateElementText('totalProjects', stats.totalProjects);
    updateElementText('openIssues', stats.openIssues);
    updateElementText('completedIssues', stats.completedIssues);
    updateElementText('upcomingDeadlines', stats.upcomingDeadlines);

    // Update progress bars
    const projectProgress = document.getElementById('overallProjectProgress');
    if (projectProgress) {
        const percentage = stats.projectCompletionPercentage || 0;
        projectProgress.style.width = `${percentage}%`;
        projectProgress.textContent = `${percentage}%`;
        projectProgress.setAttribute('aria-valuenow', percentage);
    }

    console.log("Statistics updated successfully");
}

// Load dashboard charts
async function loadCharts() {
    console.log("Loading dashboard charts");

    // Fallback chart data for testing if API fails
    const fallbackChartData = {
        projectCompletion: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [0, 10, 20, 30, 40, 50]
        },
        issueDistribution: {
            labels: ['To Do', 'In Progress', 'In Review', 'Done'],
            data: [25, 25, 25, 25]
        }
    };

    const chartData = await fetchWithFallback('/dashboard/charts', fallbackChartData);
    console.log("Chart data loaded:", chartData);

    // Project completion chart
    const projectCompletionCtx = document.getElementById('projectCompletionChart');
    if (projectCompletionCtx && chartData.projectCompletion) {
        console.log("Creating project completion chart");
        try {
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
            console.log("Project completion chart created successfully");
        } catch (chartError) {
            console.error("Error creating project completion chart:", chartError);
        }
    }

    // Issue distribution chart
    const issueDistributionCtx = document.getElementById('issueDistributionChart');
    if (issueDistributionCtx && chartData.issueDistribution) {
        console.log("Creating issue distribution chart");
        try {
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
            console.log("Issue distribution chart created successfully");
        } catch (chartError) {
            console.error("Error creating issue distribution chart:", chartError);
        }
    }
}

// Load recent projects
async function loadRecentProjects() {
    console.log("Loading recent projects");

    // Fallback projects data for testing if API fails
    const fallbackProjects = [
        {
            id: 1,
            name: "Sample Project",
            lead: { fullName: "Project Lead" },
            type: "SCRUM",
            createdAt: new Date().toISOString(),
            issues: []
        }
    ];

    const response = await fetchWithFallback('/projects?recent=true', { projects: fallbackProjects });
    const projects = response.projects || fallbackProjects;

    console.log("Recent projects loaded:", projects);

    const projectsTableBody = document.getElementById('projectsTableBody');
    if (!projectsTableBody) {
        console.warn("Projects table body element not found");
        return;
    }

    projectsTableBody.innerHTML = '';

    if (projects.length === 0) {
        console.log("No projects available");
        projectsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No projects available</td></tr>';
        return;
    }

    projects.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="../project/details.html?id=${project.id}">${project.name}</a></td>
            <td>${project.lead ? project.lead.fullName : 'Unassigned'}</td>
            <td>${getProjectStatusBadge(project.type)}</td>
            <td>${window.appHelpers?.formatDate(project.createdAt) || new Date(project.createdAt).toLocaleDateString()}</td>
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

    console.log("Projects table updated successfully");
}

// Load assigned issues
async function loadAssignedIssues() {
    console.log("Loading assigned issues");

    // Fallback issues data for testing if API fails
    const fallbackIssues = [
        {
            id: 1,
            issueKey: "SAMPLE-1",
            title: "Sample Issue",
            project: { id: 1, name: "Sample Project" },
            status: "TODO",
            priority: "MEDIUM"
        }
    ];

    const response = await fetchWithFallback('/issues/assigned', { issues: fallbackIssues });
    const issues = response.issues || fallbackIssues;

    console.log("Assigned issues loaded:", issues);

    const issuesTableBody = document.getElementById('issuesTableBody');
    if (!issuesTableBody) {
        console.warn("Issues table body element not found");
        return;
    }

    issuesTableBody.innerHTML = '';

    if (issues.length === 0) {
        console.log("No assigned issues available");
        issuesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No assigned issues</td></tr>';
        return;
    }

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

    console.log("Issues table updated successfully");
}

// Setup dashboard events
function setupDashboardEvents() {
    console.log("Setting up dashboard events");

    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        console.log("Setting up refresh button handler");
        refreshBtn.addEventListener('click', function() {
            console.log("Refresh button clicked");
            loadDashboardData();
            window.appHelpers?.showAlert('Dashboard refreshed', 'success') ||
            showFallbackContent("Dashboard refresh initiated");
        });
    } else {
        console.warn("Refresh button not found");
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

// Expose functions globally for testing if needed
window.dashboardFunctions = {
    loadDashboardData,
    loadStatistics,
    loadCharts,
    loadRecentProjects,
    loadAssignedIssues,
    setupDashboardEvents
};