// project.js - Handles all project-related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!checkAuth()) return;

    // Check if we're on the project list page
    if (window.location.pathname.includes('/views/project/list.html')) {
        loadProjects();
        setupProjectListEventListeners();
    }

    // Check if we're on the project details page
    if (window.location.pathname.includes('/views/project/details.html')) {
        loadProjectDetails();
        setupProjectDetailsEventListeners();
    }

    // Check if we're on the project create/edit page
    if (window.location.pathname.includes('/views/project/create.html') ||
        window.location.pathname.includes('/views/project/edit.html')) {
        setupProjectFormEventListeners();

        // If edit page, load project data
        if (window.location.pathname.includes('/views/project/edit.html')) {
            loadProjectForEdit();
        }
    }
});

// Load all projects
function loadProjects() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const projects = getMockProjects();

    const projectsTableBody = document.getElementById('projectsTableBody');
    if (!projectsTableBody) return;

    projectsTableBody.innerHTML = '';

    projects.forEach(project => {
        // Format dates
        const startDate = new Date(project.startDate);
        const formattedStartDate = startDate.toLocaleDateString();

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
            case 'Cancelled':
                statusBadgeClass = 'bg-danger';
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
            <td><a href="details.html?id=${project.id}">${project.name}</a></td>
            <td>${project.manager}</td>
            <td><span class="badge ${statusBadgeClass}">${project.status}</span></td>
            <td>${formattedStartDate}</td>
            <td>${formattedDeadline}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${project.progress}%" 
                        aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">${project.progress}%</div>
                </div>
            </td>
            <td>
                <a href="details.html?id=${project.id}" class="btn btn-info btn-sm" title="View">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="edit.html?id=${project.id}" class="btn btn-warning btn-sm" title="Edit">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-danger btn-sm deleteProject" data-id="${project.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        projectsTableBody.appendChild(row);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.deleteProject').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            deleteProject(projectId);
        });
    });
}

// Load project details
function loadProjectDetails() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        showAlert('No project ID specified', 'danger');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const project = getMockProjectById(projectId);

    if (!project) {
        showAlert('Project not found', 'danger');
        return;
    }

    // Set page title
    document.title = `${project.name} - Project Management System`;

    // Populate project details
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectManager').textContent = project.manager;
    document.getElementById('projectStatus').innerHTML = getStatusBadge(project.status);
    document.getElementById('projectStartDate').textContent = new Date(project.startDate).toLocaleDateString();
    document.getElementById('projectDeadline').textContent = new Date(project.deadline).toLocaleDateString();
    document.getElementById('projectDescription').textContent = project.description;

    // Set progress bar
    const progressBar = document.getElementById('projectProgress');
    if (progressBar) {
        progressBar.style.width = `${project.progress}%`;
        progressBar.textContent = `${project.progress}%`;
        progressBar.setAttribute('aria-valuenow', project.progress);

        // Set progress bar color
        if (project.progress < 25) {
            progressBar.className = 'progress-bar bg-danger';
        } else if (project.progress < 50) {
            progressBar.className = 'progress-bar bg-warning';
        } else if (project.progress < 75) {
            progressBar.className = 'progress-bar bg-info';
        } else {
            progressBar.className = 'progress-bar bg-success';
        }
    }

    // Load team members
    loadProjectTeam(projectId);

    // Load project issues
    loadProjectIssues(projectId);
}

// Load project for editing
function loadProjectForEdit() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        showAlert('No project ID specified', 'danger');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const project = getMockProjectById(projectId);

    if (!project) {
        showAlert('Project not found', 'danger');
        return;
    }

    // Set page title
    document.title = `Edit ${project.name} - Project Management System`;

    // Populate form fields
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectManager').value = project.manager;
    document.getElementById('projectStatus').value = project.status;

    // Format dates for input fields (YYYY-MM-DD)
    const startDate = new Date(project.startDate);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    document.getElementById('projectStartDate').value = formattedStartDate;

    const deadline = new Date(project.deadline);
    const formattedDeadline = deadline.toISOString().split('T')[0];
    document.getElementById('projectDeadline').value = formattedDeadline;

    document.getElementById('projectProgress').value = project.progress;
    document.getElementById('projectDescription').value = project.description;
}

// Load project team members
function loadProjectTeam(projectId) {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const teamMembers = getMockTeamMembers(projectId);

    const teamTableBody = document.getElementById('teamTableBody');
    if (!teamTableBody) return;

    teamTableBody.innerHTML = '';

    teamMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle">
                        <span class="initials">${getInitials(member.name)}</span>
                    </div>
                    <div class="ms-3">
                        <p class="fw-bold mb-1">${member.name}</p>
                        <p class="text-muted mb-0">${member.email}</p>
                    </div>
                </div>
            </td>
            <td>${member.role}</td>
            <td>${member.joinedDate}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm viewMember" data-id="${member.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm removeMember" data-id="${member.id}">
                    <i class="fas fa-user-minus"></i>
                </button>
            </td>
        `;

        teamTableBody.appendChild(row);
    });

    // Add event listeners
    document.querySelectorAll('.removeMember').forEach(button => {
        button.addEventListener('click', function() {
            const memberId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to remove this team member from the project?')) {
                // In a real app, this would be an API call
                this.closest('tr').remove();
                showAlert('Team member removed from project', 'success');
            }
        });
    });
}

// Load project issues
function loadProjectIssues(projectId) {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const issues = getMockIssues().filter(issue => issue.projectId == projectId);

    const issuesTableBody = document.getElementById('issuesTableBody');
    if (!issuesTableBody) return;

    issuesTableBody.innerHTML = '';

    issues.forEach(issue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${issue.id}</td>
            <td><a href="../issues/details.html?id=${issue.id}">${issue.title}</a></td>
            <td>${getStatusBadge(issue.status)}</td>
            <td>${getPriorityBadge(issue.priority)}</td>
            <td>${issue.assignedTo}</td>
            <td>${new Date(issue.createdDate).toLocaleDateString()}</td>
            <td>
                <a href="../issues/details.html?id=${issue.id}" class="btn btn-info btn-sm" title="View">
                    <i class="fas fa-eye"></i>
                </a>
                <a href="../issues/edit.html?id=${issue.id}" class="btn btn-warning btn-sm" title="Edit">
                    <i class="fas fa-edit"></i>
                </a>
            </td>
        `;

        issuesTableBody.appendChild(row);
    });
}

// Setup event listeners for project list page
function setupProjectListEventListeners() {
    // Filter form
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would filter the projects
            showAlert('Filters applied', 'success');
        });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            // In a real app, this would reset the filters and reload all projects
            showAlert('Filters cleared', 'info');
        });
    }

    // Search input
    const searchInput = document.getElementById('searchProjects');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // In a real app, this would filter the projects as you type
            // For demo purposes, we'll just add a small delay
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // Filter projects
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    showAlert(`Searching for: ${searchTerm}`, 'info');
                }
            }, 500);
        });
    }
}

// Setup event listeners for project details page
function setupProjectDetailsEventListeners() {
    // Add team member button
    const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
    if (addTeamMemberBtn) {
        addTeamMemberBtn.addEventListener('click', function() {
            // In a real app, this would open a modal with a form
            // For demo purposes, we'll use a prompt
            const name = prompt('Enter team member name:');
            if (name) {
                const role = prompt('Enter team member role:');
                if (role) {
                    // Add team member
                    const teamTableBody = document.getElementById('teamTableBody');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="avatar-circle">
                                    <span class="initials">${getInitials(name)}</span>
                                </div>
                                <div class="ms-3">
                                    <p class="fw-bold mb-1">${name}</p>
                                    <p class="text-muted mb-0">${name.toLowerCase().replace(' ', '.')}@example.com</p>
                                </div>
                            </div>
                        </td>
                        <td>${role}</td>
                        <td>${new Date().toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-outline-primary btn-sm viewMember" data-id="new">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm removeMember" data-id="new">
                                <i class="fas fa-user-minus"></i>
                            </button>
                        </td>
                    `;

                    teamTableBody.appendChild(row);

                    // Add event listener to new remove button
                    row.querySelector('.removeMember').addEventListener('click', function() {
                        if (confirm('Are you sure you want to remove this team member from the project?')) {
                            row.remove();
                            showAlert('Team member removed from project', 'success');
                        }
                    });

                    showAlert('Team member added to project', 'success');
                }
            }
        });
    }

    // Delete project button
    const deleteProjectBtn = document.getElementById('deleteProjectBtn');
    if (deleteProjectBtn) {
        deleteProjectBtn.addEventListener('click', function() {
            const projectId = new URLSearchParams(window.location.search).get('id');
            deleteProject(projectId);
        });
    }
}

// Setup event listeners for project form page
function setupProjectFormEventListeners() {
    // Form submission
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const projectName = document.getElementById('projectName').value;
            const projectManager = document.getElementById('projectManager').value;
            const projectStatus = document.getElementById('projectStatus').value;
            const projectStartDate = document.getElementById('projectStartDate').value;
            const projectDeadline = document.getElementById('projectDeadline').value;
            const projectProgress = document.getElementById('projectProgress').value;
            const projectDescription = document.getElementById('projectDescription').value;

            // Validate form
            if (!projectName || !projectManager || !projectStatus || !projectStartDate || !projectDeadline) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }

            // In a real app, this would be an API call to save the project
            // For demo purposes, we'll just show a success message and redirect

            showAlert('Project saved successfully', 'success');

            // Redirect to project list after a delay
            setTimeout(() => {
                window.location.href = 'list.html';
            }, 1500);
        });
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                window.location.href = 'list.html';
            }
        });
    }
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        // In a real app, this would be an API call

        // Check if we're on the details page
        if (window.location.pathname.includes('/views/project/details.html')) {
            // Redirect to project list
            showAlert('Project deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'list.html';
            }, 1500);
        } else {
            // Remove row from table
            const button = document.querySelector(`.deleteProject[data-id="${projectId}"]`);
            if (button) {
                button.closest('tr').remove();
                showAlert('Project deleted successfully', 'success');
            }
        }
    }
}

// Utility function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
}

// Mock data functions
function getMockProjects() {
    return [
        {
            id: 1,
            name: 'Website Redesign',
            manager: 'John Doe',
            status: 'Active',
            startDate: '2023-01-15',
            deadline: '2023-06-30',
            progress: 65,
            description: 'Complete redesign of the company website to improve user experience and incorporate latest design trends.'
        },
        {
            id: 2,
            name: 'Mobile App Development',
            manager: 'Jane Smith',
            status: 'On Hold',
            startDate: '2023-03-01',
            deadline: '2023-12-31',
            progress: 30,
            description: 'Development of a mobile application for Android and iOS platforms to extend our services to mobile users.'
        },
        {
            id: 3,
            name: 'Database Migration',
            manager: 'Mike Johnson',
            status: 'Completed',
            startDate: '2023-02-10',
            deadline: '2023-03-15',
            progress: 100,
            description: 'Migration of our legacy database system to a modern cloud-based solution for improved performance and scalability.'
        },
        {
            id: 4,
            name: 'CRM Integration',
            manager: 'Sarah Williams',
            status: 'Active',
            startDate: '2023-04-01',
            deadline: '2023-09-01',
            progress: 45,
            description: 'Integration of our custom CRM with other business systems to streamline operations and improve customer service.'
        },
        {
            id: 5,
            name: 'E-commerce Platform',
            manager: 'John Doe',
            status: 'Active',
            startDate: '2023-05-15',
            deadline: '2023-11-15',
            progress: 20,
            description: 'Development of an e-commerce platform to sell our products online directly to customers.'
        },
        {
            id: 6,
            name: 'Security Audit',
            manager: 'Mike Johnson',
            status: 'On Hold',
            startDate: '2023-06-01',
            deadline: '2023-07-15',
            progress: 10,
            description: 'Comprehensive security audit of all systems and implementation of recommended improvements.'
        },
        {
            id: 7,
            name: 'Employee Training Platform',
            manager: 'Jane Smith',
            status: 'Cancelled',
            startDate: '2023-02-15',
            deadline: '2023-08-30',
            progress: 15,
            description: 'Development of an internal training platform for employee skill development and compliance training.'
        },
        {
            id: 8,
            name: 'Cloud Infrastructure Migration',
            manager: 'Sarah Williams',
            status: 'Active',
            startDate: '2023-04-15',
            deadline: '2023-10-30',
            progress: 60,
            description: 'Migration of on-premises infrastructure to cloud services for improved reliability and cost efficiency.'
        }
    ];
}

function getMockProjectById(id) {
    return getMockProjects().find(project => project.id == id);
}

function getMockTeamMembers(projectId) {
    // In a real app, this would return team members filtered by project ID
    return [
        {
            id: 1,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Developer',
            joinedDate: '2023-01-20'
        },
        {
            id: 2,
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
            role: 'Designer',
            joinedDate: '2023-01-25'
        },
        {
            id: 3,
            name: 'Alice Williams',
            email: 'alice.williams@example.com',
            role: 'Tester',
            joinedDate: '2023-02-05'
        },
        {
            id: 4,
            name: 'Tom Davis',
            email: 'tom.davis@example.com',
            role: 'Project Coordinator',
            joinedDate: '2023-01-15'
        }
    ];
}

function getMockIssues() {
    return [
        {
            id: 1,
            title: 'Login page UI improvement',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdDate: '2023-02-10'
        },
        {
            id: 2,
            title: 'Database connection error',
            projectId: 3,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Bob Johnson',
            createdDate: '2023-02-15'
        },
        {
            id: 3,
            title: 'Add export to PDF feature',
            projectId: 1,
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Alice Williams',
            createdDate: '2023-03-01'
        },
        {
            id: 4,
            title: 'API integration not working',
            projectId: 2,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Mike Johnson',
            createdDate: '2023-03-05'
        },
        {
            id: 5,
            title: 'Optimize image loading',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'John Doe',
            createdDate: '2023-03-10'
        }
    ];
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