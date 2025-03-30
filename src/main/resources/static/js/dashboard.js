// dashboard.js - Handles all dashboard-related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!checkAuth()) return;

    // Load dashboard data
    loadDashboardData();

    // Initialize charts
    initCharts();

    // Load active projects
    loadActiveProjects();

    // Load recent issues
    loadRecentIssues();
});

// Load dashboard summary data
function loadDashboardData() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data

    // Update dashboard stats
    document.getElementById('totalProjects').textContent = '8';
    document.getElementById('openIssues').textContent = '18';
    document.getElementById('overallProgress').textContent = '65%';
    document.querySelector('.progress-bar').style.width = '65%';
    document.getElementById('teamMembers').textContent = '12';
}

// Initialize charts
function initCharts() {
    // Project Completion Timeline Chart
    const projectCompletionCtx = document.getElementById('projectCompletionChart');
    if (projectCompletionCtx) {
        new Chart(projectCompletionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Project Completion',
                    data: [10, 25, 40, 48, 55, 65, 72],
                    fill: false,
                    borderColor: 'rgb(78, 115, 223)',
                    tension: 0.1
                }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        titleMarginBottom: 10,
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
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

    // Issue Distribution Chart
    const issueDistributionCtx = document.getElementById('issueDistributionChart');
    if (issueDistributionCtx) {
        new Chart(issueDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Open', 'Resolved', 'In Progress'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    }
                }
            }
        });
    }
}

// Load active projects
function loadActiveProjects() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const projects = [
        {
            id: 1,
            name: 'Website Redesign',
            manager: 'John Doe',
            status: 'Active',
            deadline: '2023-06-30',
            progress: 65
        },
        {
            id: 2,
            name: 'Mobile App Development',
            manager: 'Jane Smith',
            status: 'On Hold',
            deadline: '2023-12-31',
            progress: 30
        },
        {
            id: 3,
            name: 'Database Migration',
            manager: 'Mike Johnson',
            status: 'Completed',
            deadline: '2023-03-15',
            progress: 100
        },
        {
            id: 4,
            name: 'CRM Integration',
            manager: 'Sarah Williams',
            status: 'Active',
            deadline: '2023-09-01',
            progress: 45
        },
        {
            id: 5,
            name: 'E-commerce Platform',
            manager: 'John Doe',
            status: 'Active',
            deadline: '2023-11-15',
            progress: 20
        }
    ];

    const projectsTableBody = document.getElementById('projectsTableBody');
    if (!projectsTableBody) return;

    projectsTableBody.innerHTML = '';

    projects.forEach(project => {
        // Format deadline
        const deadlineDate = new Date(project.deadline);
        const formattedDeadline = deadlineDate.toLocaleDateString();

        // Create status badge
        let statusBadgeClass = '';
        switch(project.status) {
            case 'Active':
                statusBadgeClass = 'bg-success';
                break;
            case 'On Hold':
                statusBadgeClass = 'bg-warning';
                break;
            case 'Completed':
                statusBadgeClass = 'bg-primary';
                break;
            default:
                statusBadgeClass = 'bg-secondary';
        }

        // Create progress bar class
        let progressBarClass = '';
        if (project.progress < 25) {
            progressBarClass = 'bg-danger';
        } else if (project.progress < 50) {
            progressBarClass = 'bg-warning';
        } else if (project.progress < 75) {
            progressBarClass = 'bg-info';
        } else {
            progressBarClass = 'bg-success';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="../project/details.html?id=${project.id}">${project.name}</a></td>
            <td>${project.manager}</td>
            <td><span class="badge ${statusBadgeClass}">${project.status}</span></td>
            <td>${formattedDeadline}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${project.progress}%" 
                        aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">${project.progress}%</div>
                </div>
            </td>
            <td>
                <a href="../project/details.html?id=${project.id}" class="btn btn-info btn-sm">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="../project/edit.html?id=${project.id}" class="btn btn-warning btn-sm">
                    <i class="fas fa-edit"></i>
                </a>
            </td>
        `;

        projectsTableBody.appendChild(row);
    });
}

// Load recent issues
function loadRecentIssues() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const issues = [
        {
            id: 1,
            title: 'Login page UI improvement',
            project: 'Website Redesign',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith'
        },
        {
            id: 2,
            title: 'Database connection error',
            project: 'Database Migration',
            projectId: 3,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Bob Johnson'
        },
        {
            id: 3,
            title: 'Add export to PDF feature',
            project: 'Website Redesign',
            projectId: 1,
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Alice Williams'
        },
        {
            id: 4,
            title: 'API integration not working',
            project: 'Mobile App Development',
            projectId: 2,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Mike Johnson'
        },
        {
            id: 5,
            title: 'Optimize image loading',
            project: 'Website Redesign',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'John Doe'
        }
    ];

    const issuesTableBody = document.getElementById('issuesTableBody');
    if (!issuesTableBody) return;

    issuesTableBody.innerHTML = '';

    issues.forEach(issue => {
        // Create status badge
        let statusBadgeClass = '';
        switch(issue.status) {
            case 'Open':
                statusBadgeClass = 'bg-danger';
                break;
            case 'In Progress':
                statusBadgeClass = 'bg-info';
                break;
            case 'Resolved':
                statusBadgeClass = 'bg-success';
                break;
            default:
                statusBadgeClass = 'bg-secondary';
        }

        // Create priority badge
        let priorityBadgeClass = '';
        switch(issue.priority) {
            case 'High':
                priorityBadgeClass = 'bg-danger';
                break;
            case 'Medium':
                priorityBadgeClass = 'bg-warning';
                break;
            case 'Low':
                priorityBadgeClass = 'bg-info';
                break;
            default:
                priorityBadgeClass = 'bg-secondary';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${issue.id}</td>
            <td><a href="../issues/details.html?id=${issue.id}">${issue.title}</a></td>
            <td><a href="../project/details.html?id=${issue.projectId}">${issue.project}</a></td>
            <td><span class="badge ${statusBadgeClass}">${issue.status}</span></td>
            <td><span class="badge ${priorityBadgeClass}">${issue.priority}</span></td>
            <td>${issue.assignedTo}</td>
            <td>
                <a href="../issues/details.html?id=${issue.id}" class="btn btn-info btn-sm">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="../issues/edit.html?id=${issue.id}" class="btn btn-warning btn-sm">
                    <i class="fas fa-edit"></i>
                </a>
            </td>
        `;

        issuesTableBody.appendChild(row);
    });
}

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../auth/login.html?alert=Please%20login%20to%20continue&type=warning';
        return false;
    }
    return true;
}