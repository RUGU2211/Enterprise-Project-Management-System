// project.js - Project management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we need authentication
    if (window.appHelpers && !window.appHelpers.requireAuth()) return;

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
        const projects = await window.appHelpers.apiRequest('/projects');
        if (!projects) return;

        const projectsTableBody = document.getElementById('projectsTableBody');
        if (!projectsTableBody) return;

        projectsTableBody.innerHTML = '';

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="details.html?id=${project.id}">${project.name}</a></td>
                <td>${project.lead ? project.lead.fullName : 'Unassigned'}</td>
                <td>${getStatusBadge(project.type)}</td>
                <td>${window.appHelpers.formatDate(project.createdAt)}</td>
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
        window.appHelpers.showAlert('Failed to load projects. Please try again later.', 'danger');
    }
}

// Load project details
async function loadProjectDetails() {
    try {
        const urlParams = window.appHelpers.getUrlParams();
        const projectId = urlParams.id;

        if (!projectId) {
            window.appHelpers.showAlert('No project ID specified', 'danger');
            return;
        }

        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);
        if (!project) return;

        // Set page title
        document.title = `${project.name} - Project Management System`;

        // Populate project details
        document.getElementById('projectName').textContent = project.name;
        document.getElementById('projectManager').textContent = project.lead ? project.lead.fullName : 'Unassigned';
        document.getElementById('projectStatus').innerHTML = getStatusBadge(project.type);
        document.getElementById('projectStartDate').textContent = window.appHelpers.formatDate(project.createdAt);
        document.getElementById('projectDescription').textContent = project.description || 'No description provided.';

        // Load project members
        await loadProjectMembers(project);

        // Load project issues
        await loadProjectIssues(projectId);
    } catch (error) {
        console.error('Error loading project details:', error);
        window.appHelpers.showAlert('Failed to load project details. Please try again later.', 'danger');
    }
}

// Load project members
async function loadProjectMembers(project) {
    try {
        if (!project.members) return;

        const teamTableBody = document.getElementById('teamTableBody');
        if (!teamTableBody) return;

        teamTableBody.innerHTML = '';

        project.members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle">
                            <span class="initials">${getInitials(member.fullName || member.username)}</span>
                        </div>
                        <div class="ms-3">
                            <p class="fw-bold mb-1">${member.fullName || member.username}</p>
                            <p class="text-muted mb-0">${member.email || ''}</p>
                        </div>
                    </div>
                </td>
                <td>${getRoleBadges(member.roles)}</td>
                <td>Member since ${window.appHelpers.formatDate(member.createdAt || project.createdAt)}</td>
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
        window.appHelpers.showAlert('Failed to load project members. Please try again later.', 'danger');
    }
}

// Load project issues
async function loadProjectIssues(projectId) {
    try {
        const issues = await window.appHelpers.apiRequest(`/projects/${projectId}/issues`);
        if (!issues) return;

        const issuesTableBody = document.getElementById('issuesTableBody');
        if (!issuesTableBody) return;

        issuesTableBody.innerHTML = '';

        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.issueKey}</td>
                <td><a href="../issues/details.html?id=${issue.id}">${issue.title}</a></td>
                <td>${getIssueBadge(issue.status)}</td>
                <td>${getPriorityBadge(issue.priority)}</td>
                <td>${issue.assignee ? issue.assignee.fullName : 'Unassigned'}</td>
                <td>${window.appHelpers.formatDate(issue.createdAt)}</td>
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
        window.appHelpers.showAlert('Failed to load project issues. Please try again later.', 'danger');
    }
}

// Load project for editing
async function loadProjectForEdit() {
    try {
        const urlParams = window.appHelpers.getUrlParams();
        const projectId = urlParams.id;

        if (!projectId) {
            window.appHelpers.showAlert('No project ID specified', 'danger');
            return;
        }

        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);
        if (!project) return;

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
        window.appHelpers.showAlert('Failed to load project details. Please try again later.', 'danger');
    }
}

// Setup project form
async function setupProjectForm() {
    try {
        // Load users for lead and members selection
        const users = await window.appHelpers.apiRequest('/users');
        if (!users) return;

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
                if (window.selectedMembers.includes(user.id)) return;

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
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Add team member
function addTeamMember() {
    const teamMemberSelect = document.getElementById('teamMemberSelect');

    if (!teamMemberSelect || !teamMemberSelect.value) {
        window.appHelpers.showAlert('Please select a team member', 'warning');
        return;
    }

    const userId = teamMemberSelect.value;
    const userName = teamMemberSelect.options[teamMemberSelect.selectedIndex].text;

    // Add to selected members
    window.selectedMembers = window.selectedMembers || [];
    window.selectedMembers.push(userId);

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

    // Remove from dropdown
    teamMemberSelect.remove(teamMemberSelect.selectedIndex);

    // Close modal
    const modal = document.getElementById('teamMemberModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
}

// Delete project
async function deleteProject(projectId) {
    try {
        const response = await window.appHelpers.apiRequest(`/projects/${projectId}`, {
            method: 'DELETE'
        });

        window.appHelpers.showAlert('Project deleted successfully', 'success');

        // If on details page, redirect to list
        if (window.location.pathname.includes('/views/project/details.html')) {
            setTimeout(() => {
                window.location.href = 'list.html';
            }, 1500);
        } else {
            // If on list page, remove row
            const row = document.querySelector(`.deleteProject[data-id="${projectId}"]`).closest('tr');
            row.remove();
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        window.appHelpers.showAlert('Failed to delete project. Please try again later.', 'danger');
    }
}

// Remove project member
async function removeProjectMember(projectId, memberId) {
    try {
        const response = await window.appHelpers.apiRequest(`/projects/${projectId}/members/${memberId}`, {
            method: 'DELETE'
        });

        window.appHelpers.showAlert('Team member removed successfully', 'success');

        // Remove row
        const row = document.querySelector(`.removeMember[data-id="${memberId}"]`).closest('tr');
        row.remove();
    } catch (error) {
        console.error('Error removing project member:', error);
        window.appHelpers.showAlert('Failed to remove team member. Please try again later.', 'danger');
    }
}

// Setup project filters
function setupProjectListFilters() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // TODO: Implement filtering
            window.appHelpers.showAlert('Filtering functionality will be implemented soon.', 'info');
        });
    }

    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            // Reload projects
            loadProjects();
        });
    }
}

// Setup project details events
function setupProjectDetailsEvents() {
    // Add team member button
    const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
    if (addTeamMemberBtn) {
        addTeamMemberBtn.addEventListener('click', function() {
            const projectId = new URLSearchParams(window.location.search).get('id');
            // TODO: Implement add team member
            window.appHelpers.showAlert('Add team member functionality will be implemented soon.', 'info');
        });
    }

    // Delete project button
    const deleteProjectBtn = document.getElementById('deleteProjectBtn');
    if (deleteProjectBtn) {
        deleteProjectBtn.addEventListener('click', function() {
            const projectId = new URLSearchParams(window.location.search).get('id');
            if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                deleteProject(projectId);
            }
        });
    }

    // Setup tabs
    const tabLinks = document.querySelectorAll('#projectTabs .nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Activate clicked tab
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding tab content
            const tabId = this.getAttribute('data-bs-target').substring(1);
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
                if (pane.id === tabId) {
                    pane.classList.add('show', 'active');
                }
            });
        });
    });
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
    switch(status) {
        case 'TODO':
            badgeClass = 'bg-secondary';
            break;
        case 'IN_PROGRESS':
            badgeClass = 'bg-info';
            break;
        case 'IN_REVIEW':
            badgeClass = 'bg-warning';
            break;
        case 'DONE':
            badgeClass = 'bg-success';
            break;
    }
    return `<span class="badge ${badgeClass}">${status}</span>`;
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

    return roles.map(role => {
        let badgeClass = 'bg-secondary';
        switch(role.name) {
            case 'ADMIN':
                badgeClass = 'bg-danger';
                break;
            case 'PROJECT_MANAGER':
                badgeClass = 'bg-primary';
                break;
            case 'DEVELOPER':
                badgeClass = 'bg-info';
                break;
            case 'TESTER':
                badgeClass = 'bg-warning';
                break;
            case 'USER':
                badgeClass = 'bg-secondary';
                break;
        }
        return `<span class="badge ${badgeClass} me-1">${role.name}</span>`;
    }).join(' ');
}

function getInitials(name) {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
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
        window.appHelpers.showAlert('Please fill in all required fields', 'danger');
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
                window.appHelpers.showAlert('Project updated successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${projectId}`;
                }, 1500);
            }
        } else {
            // Create new project
            response = await window.appHelpers.apiRequest('/projects', {
                method: 'POST',
                body: JSON.stringify(projectData)
            });

            if (response) {
                window.appHelpers.showAlert('Project created successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${response.id}`;
                }, 1500);
            }
        }