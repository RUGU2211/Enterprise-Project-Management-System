// project.js - Project management functionality with real API calls

document.addEventListener('DOMContentLoaded', function() {
    console.log("Project JS loaded");

    // Check if we're on the project list page
    if (window.location.pathname.includes('/views/project/list.html')) {
        loadProjects();
        setupProjectListFilters();
    }

    // Check if we're on the project details page
    if (window.location.pathname.includes('/views/project/details.html')) {
        loadProjectDetails();
        setupProjectDetailsEvents();
    }

    // Check if we're on the project create/edit page
    if (window.location.pathname.includes('/views/project/create.html') ||
        window.location.pathname.includes('/views/project/edit.html')) {

        setupProjectForm();
        loadTeamMembers();

        // If edit page, load project data
        if (window.location.pathname.includes('/views/project/edit.html')) {
            loadProjectForEdit();
        }
    }
});

// Load all projects
async function loadProjects() {
    try {
        console.log("Loading projects");

        // Use API request helper from app.js
        const response = await window.appHelpers.apiRequest('/projects');

        const projects = response && response.projects ? response.projects : [];

        const projectsTableBody = document.getElementById('projectsTableBody');
        if (!projectsTableBody) return;

        projectsTableBody.innerHTML = '';

        if (projects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No projects found</td></tr>';
            return;
        }

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="details.html?id=${project.id}">${project.name}</a></td>
                <td>${project.lead ? project.lead.fullName : 'Unassigned'}</td>
                <td>${getStatusBadge(project.type)}</td>
                <td>${formatDate(project.createdAt)}</td>
                <td>${getProgressBadge(project)}</td>
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
                if (confirm('Are you sure you want to delete this project?')) {
                    deleteProject(projectId);
                }
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        showAlert('Failed to load projects. Please try again later.', 'danger');
    }
}

// Load project details
async function loadProjectDetails() {
    try {
        console.log("Loading project details");

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) {
            showAlert('No project ID specified', 'danger');
            return;
        }

        // Fetch project details
        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);

        if (!project) {
            showAlert('Project not found', 'danger');
            return;
        }

        // Set page title
        document.title = `${project.name} - Project Management System`;

        // Populate project details
        document.getElementById('projectName').textContent = project.name;
        document.getElementById('projectKey').textContent = project.key;
        document.getElementById('projectStatus').innerHTML = getStatusBadge(project.type);
        document.getElementById('projectManager').textContent = project.lead ? project.lead.fullName : 'Unassigned';
        document.getElementById('projectType').textContent = project.type;
        document.getElementById('projectStartDate').textContent = formatDate(project.createdAt);
        document.getElementById('projectUpdateDate').textContent = formatDate(project.updatedAt);
        document.getElementById('projectDescription').textContent = project.description || 'No description provided.';

        // Calculate and display project progress
        const progressBar = document.getElementById('projectProgress');
        if (progressBar) {
            // Calculate progress based on issues status
            let totalIssues = 0;
            let completedIssues = 0;

            if (project.issues && project.issues.length > 0) {
                totalIssues = project.issues.length;
                completedIssues = project.issues.filter(issue => issue.status === 'DONE').length;
            }

            const progress = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }

        // Update issue statistics
        const issueStats = await window.appHelpers.apiRequest(`/projects/${projectId}/statistics`);

        if (issueStats) {
            document.getElementById('totalIssues').textContent = issueStats.totalIssues || '0';
            document.getElementById('openIssues').textContent = issueStats.openIssues || '0';
            document.getElementById('completedIssues').textContent = issueStats.completedIssues || '0';
        } else {
            document.getElementById('totalIssues').textContent = '0';
            document.getElementById('openIssues').textContent = '0';
            document.getElementById('completedIssues').textContent = '0';
        }

        // Load project members
        await loadProjectMembers(project);

        // Load project issues
        await loadProjectIssues(projectId);

        // Generate project charts
        generateProjectCharts(projectId);
    } catch (error) {
        console.error('Error loading project details:', error);
        showAlert('Failed to load project details. Please try again later.', 'danger');
    }
}

// Generate project charts with real data
async function generateProjectCharts(projectId) {
    try {
        // Fetch project statistics for charts
        const chartData = await window.appHelpers.apiRequest(`/projects/${projectId}/chart-data`);

        if (!chartData) return;

        // Issue Status Chart
        const statusCtx = document.getElementById('issueStatusChart');
        if (statusCtx && chartData.statusDistribution) {
            const labels = Object.keys(chartData.statusDistribution);
            const data = Object.values(chartData.statusDistribution);

            const backgroundColors = {
                'TODO': '#6c757d',
                'IN_PROGRESS': '#0dcaf0',
                'IN_REVIEW': '#ffc107',
                'DONE': '#198754'
            };

            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: labels.map(label =>
                        label === 'TODO' ? 'To Do' :
                            label === 'IN_PROGRESS' ? 'In Progress' :
                                label === 'IN_REVIEW' ? 'In Review' : 'Done'
                    ),
                    datasets: [{
                        data: data,
                        backgroundColor: labels.map(label => backgroundColors[label] || '#6c757d')
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Issues by Status'
                        }
                    }
                }
            });
        }

        // Issue Priority Chart
        const priorityCtx = document.getElementById('issuePriorityChart');
        if (priorityCtx && chartData.priorityDistribution) {
            const labels = Object.keys(chartData.priorityDistribution);
            const data = Object.values(chartData.priorityDistribution);

            const backgroundColors = {
                'HIGHEST': '#dc3545',
                'HIGH': '#fd7e14',
                'MEDIUM': '#0dcaf0',
                'LOW': '#20c997',
                'LOWEST': '#6c757d'
            };

            new Chart(priorityCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Issues by Priority',
                        data: data,
                        backgroundColor: labels.map(label => backgroundColors[label] || '#6c757d')
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Issues by Priority'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error generating project charts:', error);
    }
}

// Load project members
async function loadProjectMembers(project) {
    try {
        // Fetch project members if not provided with project
        let members = project.members;

        if (!members) {
            const membersResponse = await window.appHelpers.apiRequest(`/projects/${project.id}/members`);
            members = membersResponse || [];
        }

        if (!members || members.length === 0) return;

        const teamTableBody = document.getElementById('teamTableBody');
        if (!teamTableBody) return;

        teamTableBody.innerHTML = '';

        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle">
                            <span class="initials">${getInitials(member.fullName || member.username)}</span>
                        </div>
                        <div class="ms-3">
                            <p class="fw-bold mb-1">${member.fullName || member.username}</p>
                        </div>
                    </div>
                </td>
                <td>${getRoleBadges(member.roles)}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm removeMember" data-id="${member.id}">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </td>
            `;

            teamTableBody.appendChild(row);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.removeMember').forEach(button => {
            button.addEventListener('click', function() {
                const memberId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to remove this member from the project?')) {
                    removeProjectMember(project.id, memberId);
                }
            });
        });
    } catch (error) {
        console.error('Error loading project members:', error);
        showAlert('Failed to load project members. Please try again later.', 'danger');
    }
}

// Load project issues
async function loadProjectIssues(projectId) {
    try {
        // Fetch project issues
        const issues = await window.appHelpers.apiRequest(`/projects/${projectId}/issues`);

        if (!issues) return;

        const issuesTableBody = document.getElementById('issuesTableBody');
        if (!issuesTableBody) return;

        issuesTableBody.innerHTML = '';

        if (issues.length === 0) {
            issuesTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No issues found</td></tr>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.issueKey}</td>
                <td><a href="../issues/details.html?id=${issue.id}">${issue.title}</a></td>
                <td>${getIssueBadge(issue.status)}</td>
                <td>${getPriorityBadge(issue.priority)}</td>
                <td>${issue.assignee ? issue.assignee.fullName : 'Unassigned'}</td>
                <td>${formatDate(issue.createdAt)}</td>
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
    } catch (error) {
        console.error('Error loading project issues:', error);
        showAlert('Failed to load project issues. Please try again later.', 'danger');
    }
}

// Load project for editing
async function loadProjectForEdit() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) {
            showAlert('No project ID specified', 'danger');
            return;
        }

        // Fetch project details
        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);

        if (!project) {
            showAlert('Project not found', 'danger');
            return;
        }

        // Set page title
        document.title = `Edit ${project.name} - Project Management System`;

        // Populate form fields
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectKey').value = project.key;

        // Set lead select
        const leadSelect = document.getElementById('projectLead');
        if (leadSelect) {
            // We'll set this after loading users
            window.projectLeadId = project.lead ? project.lead.id : null;
        }

        // Set project type
        const typeSelect = document.getElementById('projectType');
        if (typeSelect) {
            typeSelect.value = project.type;
        }

        document.getElementById('projectDescription').value = project.description || '';

        // Load members
        if (project.members && project.members.length > 0) {
            const teamMemberTableBody = document.getElementById('teamMemberTableBody');
            if (teamMemberTableBody) {
                teamMemberTableBody.innerHTML = '';

                project.members.forEach(member => {
                    window.selectedMembers = window.selectedMembers || [];
                    window.selectedMembers.push(member.id);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${member.fullName || member.username}</td>
                        <td>${getRoleBadges(member.roles)}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-danger removeMember" data-id="${member.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;

                    teamMemberTableBody.appendChild(row);
                });

                // Add event listeners
                document.querySelectorAll('.removeMember').forEach(button => {
                    button.addEventListener('click', function() {
                        const memberId = this.getAttribute('data-id');
                        this.closest('tr').remove();
                        window.selectedMembers = window.selectedMembers.filter(id => id != memberId);
                    });
                });
            }
        }
    } catch (error) {
        console.error('Error loading project for edit:', error);
        showAlert('Failed to load project details. Please try again later.', 'danger');
    }
}

// Setup project form
async function setupProjectForm() {
    try {
        console.log("Setting up project form");

        // Fallback users data
        const fallbackUsers = [
            { id: 1, fullName: 'Sample User', username: 'user1' }
        ];

        // Load users for lead and members selection
        const usersResponse = await window.appHelpers.apiRequest('/users');
        const users = usersResponse?.users || fallbackUsers;

        console.log("Users loaded:", users);

        // Populate lead select
        const leadSelect = document.getElementById('projectLead');
        if (leadSelect) {
            leadSelect.innerHTML = '<option value="">Select Project Lead</option>';

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.fullName || user.username;
                leadSelect.appendChild(option);

                // If editing and this is the project lead
                if (window.projectLeadId && window.projectLeadId == user.id) {
                    option.selected = true;
                }
            });
        }

        // Store users for member selection
        window.allUsers = users;

        // Setup form submission
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', submitProjectForm);
        }

        // Setup cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
                    window.location.href = 'list.html';
                }
            });
        }

        // Setup add team member button
        const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
        if (addTeamMemberBtn) {
            addTeamMemberBtn.addEventListener('click', openAddMemberDialog);
        }

        console.log("Project form setup complete");
    } catch (error) {
        console.error('Error setting up project form:', error);
        window.appHelpers.showAlert('Failed to load form data. Please try again later.', 'danger');
    }
}

// Load team members
function loadTeamMembers() {
    // Initialize selected members array
    window.selectedMembers = window.selectedMembers || [];
}

// Open add member dialog
function openAddMemberDialog() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('teamMemberModal');

    if (!modal) {
        const modalHTML = `
            <div class="modal fade" id="teamMemberModal" tabindex="-1" aria-labelledby="teamMemberModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="teamMemberModalLabel">Add Team Member</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="teamMemberForm">
                                <div class="mb-3">
                                    <label for="teamMemberSelect" class="form-label">Team Member</label>
                                    <select class="form-select" id="teamMemberSelect" required>
                                        <option value="">Select Team Member</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveTeamMemberBtn">Add Member</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('teamMemberModal');

        // Populate users dropdown
        const teamMemberSelect = document.getElementById('teamMemberSelect');

        if (teamMemberSelect && window.allUsers) {
            teamMemberSelect.innerHTML = '<option value="">Select Team Member</option>';

            window.allUsers.forEach(user => {
                // Skip users who are already members
                if (window.selectedMembers && window.selectedMembers.includes(user.id)) return;

                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.fullName || user.username;
                teamMemberSelect.appendChild(option);
            });
        }

        // Add event listener to save button
        const saveBtn = document.getElementById('saveTeamMemberBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', addTeamMember);
        }
    }

    // Show modal
    if (window.bootstrap && window.bootstrap.Modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } else {
        showAlert('Bootstrap components not loaded. Cannot display modal.', 'warning');
    }
}

// Add team member
function addTeamMember() {
    const teamMemberSelect = document.getElementById('teamMemberSelect');

    if (!teamMemberSelect || !teamMemberSelect.value) {
        showAlert('Please select a team member', 'warning');
        return;
    }

    const userId = teamMemberSelect.value;
    const userName = teamMemberSelect.options[teamMemberSelect.selectedIndex].text;

    // Add to selected members
    window.selectedMembers = window.selectedMembers || [];
    window.selectedMembers.push(parseInt(userId));

    // Add to table
    const teamMemberTableBody = document.getElementById('teamMemberTableBody');
    if (teamMemberTableBody) {
        // Remove "no members" row if exists
        const noMembersRow = document.getElementById('noMembersRow');
        if (noMembersRow) {
            noMembersRow.remove();
        }

        // Add new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userName}</td>
            <td>Team Member</td>
            <td>
                <button type="button" class="btn btn-sm btn-danger removeMember" data-id="${userId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        teamMemberTableBody.appendChild(row);

        // Add event listener to remove button
        row.querySelector('.removeMember').addEventListener('click', function() {
            const memberId = this.getAttribute('data-id');
            row.remove();
            window.selectedMembers = window.selectedMembers.filter(id => id != memberId);

            // Add back to dropdown
            const teamMemberSelect = document.getElementById('teamMemberSelect');
            if (teamMemberSelect && window.allUsers) {
                const user = window.allUsers.find(u => u.id == memberId);
                if (user) {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.fullName || user.username;
                    teamMemberSelect.appendChild(option);
                }
            }
        });
    }

    // Close modal
    const modal = document.getElementById('teamMemberModal');
    if (window.bootstrap && window.bootstrap.Modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) {
            bsModal.hide();
        }
    }
}

// Delete project
async function deleteProject(projectId) {
    try {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            // API call to delete project
            const response = await window.appHelpers.apiRequest(`/projects/${projectId}`, {
                method: 'DELETE'
            });

            if (response || response === null) {
                showAlert('Project deleted successfully', 'success');

                // If on details page, redirect to list
                if (window.location.pathname.includes('/views/project/details.html')) {
                    setTimeout(() => {
                        window.location.href = 'list.html';
                    }, 1500);
                } else {
                    // If on list page, remove row
                    const row = document.querySelector(`.deleteProject[data-id="${projectId}"]`).closest('tr');
                    if (row) {
                        row.remove();
                    }
                }
            } else {
                showAlert('Failed to delete project', 'danger');
            }
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showAlert('Failed to delete project. Please try again later.', 'danger');
    }
}

// Remove project member
async function removeProjectMember(projectId, memberId) {
    try {
        // API call to remove member
        const response = await window.appHelpers.apiRequest(`/projects/${projectId}/members/${memberId}`, {
            method: 'DELETE'
        });

        if (response || response === null) {
            showAlert('Team member removed successfully', 'success');

            // Remove row
            const row = document.querySelector(`.removeMember[data-id="${memberId}"]`).closest('tr');
            if (row) {
                row.remove();
            }
        } else {
            showAlert('Failed to remove team member', 'danger');
        }
    } catch (error) {
        console.error('Error removing project member:', error);
        showAlert('Failed to remove team member. Please try again later.', 'danger');
    }
}

// Setup project filters
function setupProjectListFilters() {
    // Load filter options
    loadFilterOptions();

    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get filter values
            const status = document.getElementById('statusFilter')?.value;
            const manager = document.getElementById('managerFilter')?.value;
            const dateRange = document.getElementById('dateFilter')?.value;

            // Build query string
            let queryParams = [];
            if (status) queryParams.push(`status=${status}`);
            if (manager) queryParams.push(`leadId=${manager}`);
            if (dateRange) queryParams.push(`dateRange=${dateRange}`);

            // Apply filters
            if (queryParams.length > 0) {
                const queryString = queryParams.join('&');
                loadProjectsWithFilters(queryString);
            } else {
                loadProjects();
            }
        });
    }

    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            loadProjects();
        });
    }
}

// Load filter options
async function loadFilterOptions() {
    try {
        // Load users for lead filter
        const users = await window.appHelpers.apiRequest('/users');

        if (users) {
            const managerFilter = document.getElementById('managerFilter');
            if (managerFilter) {
                managerFilter.innerHTML = '<option value="">All</option>';

                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.fullName || user.username;
                    managerFilter.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading filter options:', error);
    }
}

// Load projects with filters
async function loadProjectsWithFilters(queryString) {
    try {
        const response = await window.appHelpers.apiRequest(`/projects?${queryString}`);

        if (response && response.projects) {
            const projectsTableBody = document.getElementById('projectsTableBody');
            if (!projectsTableBody) return;

            projectsTableBody.innerHTML = '';

            if (response.projects.length === 0) {
                projectsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No projects match the filter criteria</td></tr>';
                return;
            }

            response.projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="details.html?id=${project.id}">${project.name}</a></td>
                    <td>${project.lead ? project.lead.fullName : 'Unassigned'}</td>
                    <td>${getStatusBadge(project.type)}</td>
                    <td>${formatDate(project.createdAt)}</td>
                    <td>${getProgressBadge(project)}</td>
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

            // Re-add event listeners to delete buttons
            document.querySelectorAll('.deleteProject').forEach(button => {
                button.addEventListener('click', function() {
                    const projectId = this.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this project?')) {
                        deleteProject(projectId);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading filtered projects:', error);
        showAlert('Failed to apply filters. Please try again later.', 'danger');
    }
}

// Setup project details events
function setupProjectDetailsEvents() {
    // Add team member button
    const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
    if (addTeamMemberBtn) {
        addTeamMemberBtn.addEventListener('click', function() {
            openAddMemberDialog();
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

    // Export project button
    const exportProjectBtn = document.getElementById('exportProjectBtn');

    if (exportProjectBtn) {
        exportProjectBtn.addEventListener('click', async function() {
            try {
                const projectId = new URLSearchParams(window.location.search).get('id');

                // Initiate export
                const response = await window.appHelpers.apiRequest(`/projects/${projectId}/export`, {
                    method: 'GET',
                    responseType: 'blob'
                });

                if (response) {
                    // Create download link
                    const url = window.URL.createObjectURL(new Blob([response]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `project-${projectId}-export.json`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    showAlert('Project exported successfully', 'success');
                } else {
                    showAlert('Failed to export project', 'danger');
                }
            } catch (error) {  // <-- Corrected placement of the catch block
                console.error('Error exporting project:', error);
                showAlert('Export failed. Please try again later.', 'danger');
            }
        });
    }

}

// Submit project form
    async function submitProjectForm(e) {
        e.preventDefault();

        // Get form data
        const projectId = new URLSearchParams(window.location.search).get('id');
        const projectName = document.getElementById('projectName').value;
        const projectKey = document.getElementById('projectKey').value;
        const projectLead = document.getElementById('projectLead').value;
        const projectType = document.getElementById('projectType').value;
        const projectDescription = document.getElementById('projectDescription').value;

        // Validate form
        if (!projectName || !projectKey || !projectLead || !projectType) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }

        // Validate project key format
        if (!/^[A-Z0-9]{2,10}$/.test(projectKey)) {
            showAlert('Project key must be 2-10 uppercase letters or numbers', 'danger');
            return;
        }

        // Create project data
        const projectData = {
            name: projectName,
            key: projectKey,
            lead: { id: projectLead },
            type: projectType,
            description: projectDescription,
            members: window.selectedMembers ? window.selectedMembers.map(id => ({ id })) : []
        };

        try {
            let response;

            if (projectId) {
                // Update existing project
                response = await window.appHelpers.apiRequest(`/projects/${projectId}`, {
                    method: 'PUT',
                    body: JSON.stringify(projectData)
                });

                if (response) {
                    showAlert('Project updated successfully', 'success');
                    setTimeout(() => {
                        window.location.href = `details.html?id=${projectId}`;
                    }, 1500);
                } else {
                    showAlert('Failed to update project', 'danger');
                }
            } else {
                // Create new project
                response = await window.appHelpers.apiRequest('/projects', {
                    method: 'POST',
                    body: JSON.stringify(projectData)
                });

                if (response && response.id) {
                    showAlert('Project created successfully', 'success');
                    setTimeout(() => {
                        window.location.href = `details.html?id=${response.id}`;
                    }, 1500);
                } else {
                    showAlert('Failed to create project', 'danger');
                }
            }
        } catch (error) {
            console.error('Error saving project:', error);

            // Check for specific error types
            if (error.status === 409) {
                showAlert('Project key already exists. Please choose another key.', 'danger');
            } else {
                showAlert('Failed to save project. Please try again later.', 'danger');
            }
        }
    }

// Helper functions
    function getStatusBadge(status) {
        let badgeClass = 'bg-secondary';
        switch(status) {
            case 'SCRUM':
                badgeClass = 'bg-primary';
                break;
            case 'KANBAN':
                badgeClass = 'bg-info';
                break;
            case 'Active':
                badgeClass = 'bg-success';
                break;
            case 'On Hold':
                badgeClass = 'bg-warning';
                break;
            case 'Completed':
                badgeClass = 'bg-primary';
                break;
            case 'Cancelled':
                badgeClass = 'bg-danger';
                break;
        }
        return `<span class="badge ${badgeClass}">${status}</span>`;
    }

    function getProgressBadge(project) {
        // Calculate completion percentage based on issues
        let completion = 0;
        if (project.issues && project.issues.length > 0) {
            const doneIssues = project.issues.filter(issue => issue.status === 'DONE').length;
            completion = Math.round((doneIssues / project.issues.length) * 100);
        }

        let badgeClass = 'bg-danger';
        if (completion >= 75) {
            badgeClass = 'bg-success';
        } else if (completion >= 50) {
            badgeClass = 'bg-info';
        } else if (completion >= 25) {
            badgeClass = 'bg-warning';
        }

        return `
       <div class="progress">
           <div class="progress-bar ${badgeClass}" role="progressbar" style="width: ${completion}%" 
               aria-valuenow="${completion}" aria-valuemin="0" aria-valuemax="100">${completion}%</div>
       </div>
   `;
    }

    function getIssueBadge(status) {
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

    function getPriorityBadge(priority) {
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

    function getRoleBadges(roles) {
        if (!roles || roles.length === 0) return 'No roles assigned';

        if (typeof roles === 'string') {
            return `<span class="badge bg-secondary">${roles}</span>`;
        }

        return roles.map(role => {
            let badgeClass = 'bg-secondary';
            let roleName = typeof role === 'string' ? role : (role.name || 'ROLE');

            switch(roleName) {
                case 'ADMIN':
                case 'ROLE_ADMIN':
                    badgeClass = 'bg-danger';
                    roleName = roleName.replace('ROLE_', '');
                    break;
                case 'PROJECT_MANAGER':
                case 'ROLE_PROJECT_MANAGER':
                    badgeClass = 'bg-primary';
                    roleName = roleName.replace('ROLE_', '');
                    break;
                case 'DEVELOPER':
                case 'ROLE_DEVELOPER':
                    badgeClass = 'bg-info';
                    roleName = roleName.replace('ROLE_', '');
                    break;
                case 'TESTER':
                case 'ROLE_TESTER':
                    badgeClass = 'bg-warning';
                    roleName = roleName.replace('ROLE_', '');
                    break;
                case 'USER':
                case 'ROLE_USER':
                    badgeClass = 'bg-secondary';
                    roleName = roleName.replace('ROLE_', '');
                    break;
            }
            return `<span class="badge ${badgeClass} me-1">${roleName}</span>`;
        }).join(' ');
    }

    function getInitials(name) {
        if (!name) return 'NA';

        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }

    function showAlert(message, type = 'success') {
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        if (!alertPlaceholder) {
            console.warn('Alert placeholder not found');
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
       <div class="alert alert-${type} alert-dismissible fade show" role="alert">
           ${message}
           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
       </div>
   `;

        alertPlaceholder.innerHTML = '';
        alertPlaceholder.appendChild(wrapper);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            const alert = wrapper.querySelector('.alert');
            if (alert) {
                if (window.bootstrap && window.bootstrap.Alert) {
                    const bsModal = new bootstrap.Alert(alert);
                    bsModal.close();
                } else {
                    alert.classList.remove('show');
                    setTimeout(() => {
                        wrapper.remove();
                    }, 150);
                }
            }
        }, 3000);
}