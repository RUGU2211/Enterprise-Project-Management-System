// sprint.js - Sprint management functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we need authentication
    if (window.appHelpers && !window.appHelpers.requireAuth()) return;

    // Check if we're on the sprint list page
    if (window.location.pathname.includes('/views/sprint/list.html')) {
        loadSprints();
        setupSprintListFilters();
    }

    // Check if we're on the sprint details page
    if (window.location.pathname.includes('/views/sprint/details.html')) {
        loadSprintDetails();
        setupSprintDetailsEvents();
    }

    // Check if we're on the sprint create/edit page
    if (window.location.pathname.includes('/views/sprint/create.html') ||
        window.location.pathname.includes('/views/sprint/edit.html')) {

        setupSprintForm();

        // If edit page, load sprint data
        if (window.location.pathname.includes('/views/sprint/edit.html')) {
            loadSprintForEdit();
        }
    }
});

// Load all sprints
async function loadSprints() {
    try {
        const response = await window.appHelpers.apiRequest('/sprints');
        const sprints = response?.sprints || [];

        const sprintsTableBody = document.getElementById('sprintsTableBody');
        if (!sprintsTableBody) return;

        sprintsTableBody.innerHTML = '';

        if (sprints.length === 0) {
            sprintsTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No sprints found</td></tr>';
            return;
        }

        sprints.forEach(sprint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="details.html?id=${sprint.id}">${sprint.name}</a></td>
                <td><a href="../project/details.html?id=${sprint.project.id}">${sprint.project.name}</a></td>
                <td>${sprint.goal || 'N/A'}</td>
                <td>${getSprintStatusBadge(sprint.status)}</td>
                <td>${window.appHelpers.formatDate(sprint.startDate)}</td>
                <td>${window.appHelpers.formatDate(sprint.endDate)}</td>
                <td>
                    <a href="details.html?id=${sprint.id}" class="btn btn-info btn-sm" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="edit.html?id=${sprint.id}" class="btn btn-warning btn-sm" title="Edit">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-danger btn-sm deleteSprint" data-id="${sprint.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            sprintsTableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.deleteSprint').forEach(button => {
            button.addEventListener('click', function() {
                const sprintId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this sprint?')) {
                    deleteSprint(sprintId);
                }
            });
        });

        // Check for active sprint
        const activeSprintContainer = document.getElementById('activeSprint');
        if (activeSprintContainer) {
            const activeSprint = sprints.find(sprint => sprint.status === 'ACTIVE');
            if (activeSprint) {
                activeSprintContainer.innerHTML = createActiveSprintCard(activeSprint);
            } else {
                activeSprintContainer.innerHTML = '';
            }
        }
    } catch (error) {
        console.error('Error loading sprints:', error);
        window.appHelpers.showAlert('Failed to load sprints. Please try again later.', 'danger');
    }
}

// Create active sprint card HTML
function createActiveSprintCard(activeSprint) {
    return `
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-running me-2"></i> Active Sprint</h5>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <h4><a href="details.html?id=${activeSprint.id}" class="text-decoration-none">${activeSprint.name}</a></h4>
                    <p><strong>Project:</strong> <a href="../project/details.html?id=${activeSprint.project.id}">${activeSprint.project.name}</a></p>
                    <p><strong>Duration:</strong> ${window.appHelpers.formatDate(activeSprint.startDate)} - ${window.appHelpers.formatDate(activeSprint.endDate)}</p>
                    ${activeSprint.goal ? `<p><strong>Goal:</strong> ${activeSprint.goal}</p>` : ''}
                </div>
                <div class="col-md-6">
                    <div class="d-flex flex-column h-100 justify-content-center">
                        <h6 class="mb-2">Sprint Progress</h6>
                        <div class="progress mb-2" style="height: 25px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${calculateSprintProgress(activeSprint)}%" 
                                aria-valuenow="${calculateSprintProgress(activeSprint)}" aria-valuemin="0" aria-valuemax="100">
                                ${calculateSprintProgress(activeSprint)}%
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <a href="details.html?id=${activeSprint.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-eye me-1"></i> View Sprint
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load sprint details
async function loadSprintDetails() {
    try {
        const sprintId = new URLSearchParams(window.location.search).get('id');
        if (!sprintId) {
            window.appHelpers.showAlert('No sprint ID specified', 'danger');
            return;
        }

        const sprint = await window.appHelpers.apiRequest(`/sprints/${sprintId}`);
        if (!sprint) return;

        // Populate sprint details
        document.getElementById('sprintName').textContent = sprint.name;
        document.getElementById('projectLink').textContent = sprint.project.name;
        document.getElementById('projectLink').href = `../project/details.html?id=${sprint.project.id}`;
        document.getElementById('sprintStatus').innerHTML = getSprintStatusBadge(sprint.status);
        document.getElementById('startDate').textContent = window.appHelpers.formatDate(sprint.startDate);
        document.getElementById('endDate').textContent = window.appHelpers.formatDate(sprint.endDate);
        document.getElementById('sprintGoal').textContent = sprint.goal || 'No specific goal for this sprint.';

        // Calculate and display sprint duration and time remaining
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const today = new Date();

        const durationDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('duration').textContent = `${durationDays} days`;

        let remainingDays = Math.round((endDate - today) / (1000 * 60 * 60 * 24)) + 1;
        if (remainingDays < 0) remainingDays = 0;

        if (sprint.status === 'COMPLETED') {
            document.getElementById('timeRemaining').textContent = 'Completed';
        } else if (sprint.status === 'PLANNING') {
            document.getElementById('timeRemaining').textContent = 'Not Started';
        } else {
            document.getElementById('timeRemaining').textContent = `${remainingDays} days`;
        }

        // Toggle button visibility based on sprint status
        const startSprintBtn = document.getElementById('startSprintBtn');
        const completeSprintBtn = document.getElementById('completeSprintBtn');

        if (startSprintBtn) {
            startSprintBtn.style.display = sprint.status === 'PLANNING' ? 'inline-block' : 'none';
        }

        if (completeSprintBtn) {
            completeSprintBtn.style.display = sprint.status === 'ACTIVE' ? 'inline-block' : 'none';
        }

        // Load sprint issues and update board
        await loadSprintIssues(sprint);

        // Generate burndown chart
        generateBurndownChart(sprint);
    } catch (error) {
        console.error('Error loading sprint details:', error);
        window.appHelpers.showAlert('Failed to load sprint details. Please try again later.', 'danger');
    }
}

// Load sprint issues
async function loadSprintIssues(sprint) {
    try {
        const issues = await window.appHelpers.apiRequest(`/sprints/${sprint.id}/issues`);
        if (!issues) return;

        // Calculate statistics
        const totalIssues = issues.length;
        const completedIssues = issues.filter(issue => issue.status === 'DONE').length;

        let totalStoryPoints = 0;
        let completedStoryPoints = 0;

        issues.forEach(issue => {
            if (issue.storyPoints) {
                totalStoryPoints += issue.storyPoints;
                if (issue.status === 'DONE') {
                    completedStoryPoints += issue.storyPoints;
                }
            }
        });

        // Update statistics
        document.getElementById('totalIssues').textContent = totalIssues;
        document.getElementById('completedIssues').textContent = completedIssues;
        document.getElementById('totalStoryPoints').textContent = totalStoryPoints;
        document.getElementById('completedStoryPoints').textContent = completedStoryPoints;

        // Calculate and update progress
        const progressPercentage = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;
        const progressBar = document.getElementById('sprintProgress');

        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.textContent = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);

            // Update progress bar color
            progressBar.className = getProgressBarClass(progressPercentage);
        }

        // Group issues by status
        const issuesByStatus = {
            'TODO': issues.filter(issue => issue.status === 'TODO'),
            'IN_PROGRESS': issues.filter(issue => issue.status === 'IN_PROGRESS'),
            'IN_REVIEW': issues.filter(issue => issue.status === 'IN_REVIEW'),
            'DONE': issues.filter(issue => issue.status === 'DONE')
        };

        // Update counts
        document.getElementById('todoCount').textContent = issuesByStatus.TODO.length;
        document.getElementById('inProgressCount').textContent = issuesByStatus.IN_PROGRESS.length;
        document.getElementById('inReviewCount').textContent = issuesByStatus.IN_REVIEW.length;
        document.getElementById('doneCount').textContent = issuesByStatus.DONE.length;

        // Update board columns
        updateSprintBoardColumn('todoIssues', issuesByStatus.TODO);
        updateSprintBoardColumn('inProgressIssues', issuesByStatus.IN_PROGRESS);
        updateSprintBoardColumn('inReviewIssues', issuesByStatus.IN_REVIEW);
        updateSprintBoardColumn('doneIssues', issuesByStatus.DONE);
    } catch (error) {
        console.error('Error loading sprint issues:', error);
        window.appHelpers.showAlert('Failed to load sprint issues. Please try again later.', 'danger');
    }
}

// Update sprint board column
function updateSprintBoardColumn(columnId, issues) {
    const column = document.getElementById(columnId);
    if (!column) return;

    column.innerHTML = '';

    if (issues.length === 0) {
        column.innerHTML = '<p class="text-center text-muted">No issues</p>';
        return;
    }

    issues.forEach(issue => {
        const issueCard = document.createElement('div');
        issueCard.className = 'card mb-2 issue-card';
        issueCard.innerHTML = `
            <div class="card-body p-2">
                <h6 class="card-title mb-1">
                    <a href="../issues/details.html?id=${issue.id}" class="text-decoration-none">
                        ${issue.issueKey}: ${issue.title}
                    </a>
                </h6>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <div>
                        ${getIssuePriorityBadge(issue.priority)}
                        ${getIssueTypeBadge(issue.type)}
                    </div>
                    <div>
                        ${issue.storyPoints ? `<span class="badge bg-secondary me-1">${issue.storyPoints} SP</span>` : ''}
                        ${issue.assignee ?
            `<span class="avatar-circle avatar-xs" title="${issue.assignee.fullName || issue.assignee.username}">
                                <span class="initials">${getInitials(issue.assignee.fullName || issue.assignee.username)}</span>
                             </span>` :
            ''}
                    </div>
                </div>
            </div>
        `;

        column.appendChild(issueCard);
    });
}

// Get progress bar class based on percentage
function getProgressBarClass(percentage) {
    if (percentage < 25) {
        return 'progress-bar bg-danger';
    } else if (percentage < 50) {
        return 'progress-bar bg-warning';
    } else if (percentage < 75) {
        return 'progress-bar bg-info';
    } else {
        return 'progress-bar bg-success';
    }
}

// Remaining functions like setupSprintForm, loadSprintForEdit, submitSprintForm, etc. would be added here (from the previous implementation)

// Helper functions
function getSprintStatusBadge(status) {
    let badgeClass = 'bg-secondary';
    switch(status) {
        case 'PLANNING':
            badgeClass = 'bg-secondary';
            break;
        case 'ACTIVE':
            badgeClass = 'bg-success';
            break;
        case 'COMPLETED':
            badgeClass = 'bg-primary';
            break;
    }
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

function getIssuePriorityBadge(priority) {
    let badgeClass = 'bg-secondary';
    switch(priority) {
        case 'HIGHEST':
            badgeClass = 'bg-danger';
            break;
        case 'HIGH':
            badgeClass = 'bg-warning';
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
    return `<span class="badge ${badgeClass} me-1">${priority}</span>`;
}

function getIssueTypeBadge(type) {
    let badgeClass = 'bg-secondary';
    let icon = '';

    switch(type) {
        case 'STORY':
            badgeClass = 'bg-success';
            icon = '<i class="fas fa-book-open me-1"></i>';
            break;
        case 'BUG':
            badgeClass = 'bg-danger';
            icon = '<i class="fas fa-bug me-1"></i>';
            break;
        case 'TASK':
            badgeClass = 'bg-info';
            icon = '<i class="fas fa-tasks me-1"></i>';
            break;
        case 'EPIC':
            badgeClass = 'bg-primary';
            icon = '<i class="fas fa-bolt me-1"></i>';
            break;
    }

    return `<span class="badge ${badgeClass}">${icon}${type}</span>`;
}

function getInitials(name) {
    if (!name) return 'NA';

    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
}

// Calculate sprint progress based on timeline
function calculateSprintProgress(sprint) {
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const today = new Date();

    if (sprint.status === 'PLANNING') return 0;
    if (sprint.status === 'COMPLETED') return 100;

    // Calculate progress based on timeline
    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const daysElapsed = Math.round((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let progress = Math.round((daysElapsed / totalDays) * 100);

    // Ensure progress is between 0 and 100
    progress = Math.max(0, Math.min(progress, 100));

    return progress;
}

// Burndown chart generation
function generateBurndownChart(sprint) {
    const burndownChartCanvas = document.getElementById('burndownChart');
    if (!burndownChartCanvas) return;

    // Generate dates between sprint start and end date
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const today = new Date();

    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate labels (dates in MM/DD format)
    const labels = dates.map(date => `${date.getMonth() + 1}/${date.getDate()}`);

    // Placeholder data - in a real application, you would fetch actual burndown data from the backend
    const totalPoints = sprint.totalStoryPoints || 100; // Example total story points
    const idealBurndown = dates.map((date, index) => {
        return totalPoints - (totalPoints / (dates.length - 1)) * index;
    });

    const actualBurndown = [];
    dates.forEach((date, index) => {
        if (date <= today) {
            // Simulated actual burndown with some deviation from ideal
            const deviation = Math.random() * 10 - 5; // Random deviation between -5 and 5
            const value = idealBurndown[index] + deviation;
            actualBurndown.push(Math.max(0, Math.round(value)));
        } else {
            actualBurndown.push(null); // No data for future dates
        }
    });

    // Create chart using Chart.js
    new Chart(burndownChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ideal Burndown',
                    data: idealBurndown,
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Actual Burndown',
                    data: actualBurndown,
                    borderColor: 'rgba(28, 200, 138, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(28, 200, 138, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Remaining Story Points'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sprint Days'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Story Points: ' + context.parsed.y;
                        }
                    }
                }
            }
        }
    });
}

// Setup sprint form
async function setupSprintForm() {
    try {
        console.log("Setting up sprint form");

        // Fallback projects data
        const fallbackProjects = [
            {
                id: 1,
                name: "Sample Scrum Project",
                type: "SCRUM"
            }
        ];

        // Load projects
        const projectsResponse = await window.appHelpers.apiRequest('/projects');
        const projects = projectsResponse?.projects || fallbackProjects;

        console.log("Projects loaded:", projects);

        // Populate project select
        const projectSelect = document.getElementById('sprintProject');
        if (projectSelect) {
            projectSelect.innerHTML = '<option value="">Select Project</option>';

            // Filter to only show Scrum projects
            const scrumProjects = projects.filter(project => project.type === 'SCRUM');

            scrumProjects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                projectSelect.appendChild(option);

                // If editing and this is the project
                if (window.sprintProjectId && window.sprintProjectId == project.id) {
                    option.selected = true;
                }
            });

            // Add informative note about Scrum projects
            const noteElement = document.querySelector('.form-text');
            if (noteElement && scrumProjects.length === 0) {
                noteElement.textContent = 'No Scrum projects available. Create a Scrum project first.';
                noteElement.classList.add('text-warning');
            }
        }

        // Set default sprint dates
        const startDateInput = document.getElementById('sprintStartDate');
        const endDateInput = document.getElementById('sprintEndDate');
        if (startDateInput && endDateInput) {
            const today = new Date();
            startDateInput.valueAsDate = today;

            // Default sprint duration: 2 weeks
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 13);  // 14 days total
            endDateInput.valueAsDate = endDate;
        }

        // Setup form submission
        const sprintForm = document.getElementById('sprintForm');
        if (sprintForm) {
            sprintForm.addEventListener('submit', submitSprintForm);
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

        console.log("Sprint form setup complete");
    } catch (error) {
        console.error('Error setting up sprint form:', error);
        window.appHelpers.showAlert('Failed to load form data. Please try again later.', 'danger');
    }
}

// Load sprint for editing
async function loadSprintForEdit() {
    try {
        const sprintId = new URLSearchParams(window.location.search).get('id');
        if (!sprintId) {
            window.appHelpers.showAlert('No sprint ID specified', 'danger');
            return;
        }

        const sprint = await window.appHelpers.apiRequest(`/sprints/${sprintId}`);
        if (!sprint) return;

        // Set page title
        document.title = `Edit Sprint - ${sprint.name}`;

        // Populate form fields
        document.getElementById('sprintName').value = sprint.name;
        document.getElementById('sprintGoal').value = sprint.goal || '';

        // Select project (will be set after loading projects)
        window.sprintProjectId = sprint.project.id;

        // Format dates for input fields (YYYY-MM-DD)
        document.getElementById('sprintStartDate').value = sprint.startDate;
        document.getElementById('sprintEndDate').value = sprint.endDate;

        // Set status
        const statusSelect = document.getElementById('sprintStatus');
        if (statusSelect) {
            statusSelect.value = sprint.status;

            // Only allow editing status in certain conditions
            statusSelect.disabled = sprint.status !== 'PLANNING';

            // Add info text if status is not editable
            if (sprint.status !== 'PLANNING') {
                const statusFormText = document.querySelector('#sprintStatus + .form-text');
                if (statusFormText) {
                    statusFormText.textContent = 'Sprint status can only be changed using the Start or Complete buttons.';
                }
            }
        }
    } catch (error) {
        console.error('Error loading sprint for edit:', error);
        window.appHelpers.showAlert('Failed to load sprint details. Please try again later.', 'danger');
    }
}

// Submit sprint form
async function submitSprintForm(e) {
    e.preventDefault();

    // Get form data
    const sprintId = new URLSearchParams(window.location.search).get('id');
    const sprintName = document.getElementById('sprintName').value;
    const sprintProject = document.getElementById('sprintProject').value;
    const sprintGoal = document.getElementById('sprintGoal').value;
    const sprintStartDate = document.getElementById('sprintStartDate').value;
    const sprintEndDate = document.getElementById('sprintEndDate').value;
    const sprintStatus = document.getElementById('sprintStatus').value;

    // Validate form
    if (!sprintName || !sprintProject || !sprintStartDate || !sprintEndDate) {
        window.appHelpers.showAlert('Please fill in all required fields', 'danger');
        return;
    }

    // Validate dates
    const startDate = new Date(sprintStartDate);
    const endDate = new Date(sprintEndDate);

    if (endDate < startDate) {
        window.appHelpers.showAlert('End date cannot be before start date', 'danger');
        return;
    }

    // Create sprint data
    const sprintData = {
        name: sprintName,
        project: { id: sprintProject },
        goal: sprintGoal,
        startDate: sprintStartDate,
        endDate: sprintEndDate,
        status: sprintStatus || 'PLANNING'
    };

    try {
        let response;

        if (sprintId) {
            // Update existing sprint
            response = await window.appHelpers.apiRequest(`/sprints/${sprintId}`, {
                method: 'PUT',
                body: JSON.stringify(sprintData)
            });

            if (response) {
                window.appHelpers.showAlert('Sprint updated successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${sprintId}`;
                }, 1500);
            }
        } else {
            // Create new sprint
            response = await window.appHelpers.apiRequest('/sprints', {
                method: 'POST',
                body: JSON.stringify(sprintData)
            });

            if (response) {
                window.appHelpers.showAlert('Sprint created successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${response.id}`;
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Error saving sprint:', error);
        window.appHelpers.showAlert('Failed to save sprint. Please try again later.', 'danger');
    }
}

// Add global sprint management functions
window.sprintFunctions = {
    loadSprints,
    loadSprintDetails,
    setupSprintForm,
    submitSprintForm,
    startSprint,
    completeSprint,
    deleteSprint
};

// Start sprint
async function startSprint(sprintId) {
    try {
        const response = await window.appHelpers.apiRequest(`/sprints/${sprintId}/start`, {
            method: 'PUT'
        });

        if (response) {
            window.appHelpers.showAlert('Sprint started successfully', 'success');
            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    } catch (error) {
        console.error('Error starting sprint:', error);
        window.appHelpers.showAlert('Failed to start sprint. Please try again later.', 'danger');
    }
}

// Complete sprint
async function completeSprint(sprintId) {
    try {
        const response = await window.appHelpers.apiRequest(`/sprints/${sprintId}/complete`, {
            method: 'PUT'
        });

        if (response) {
            window.appHelpers.showAlert('Sprint completed successfully', 'success');
            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    } catch (error) {
        console.error('Error completing sprint:', error);
        window.appHelpers.showAlert('Failed to complete sprint. Please try again later.', 'danger');
    }
}

// Delete sprint
async function deleteSprint(sprintId) {
    try {
        const response = await window.appHelpers.apiRequest(`/sprints/${sprintId}`, {
            method: 'DELETE'
        });

        window.appHelpers.showAlert('Sprint deleted successfully', 'success');

        // Redirect to sprint list
        setTimeout(() => {
            window.location.href = 'list.html';
        }, 1500);
    } catch (error) {
        console.error('Error deleting sprint:', error);
        window.appHelpers.showAlert('Failed to delete sprint. Please try again later.', 'danger');
    }
}