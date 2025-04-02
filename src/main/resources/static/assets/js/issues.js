// issues.js - Issues management functionality (enhanced version)

document.addEventListener('DOMContentLoaded', function() {
    // Check if we need authentication
    if (window.appHelpers && !window.appHelpers.requireAuth()) return;

    // Check if we're on the issues list page
    if (window.location.pathname.includes('/views/issues/list.html')) {
        loadIssues();
        setupIssuesListFilters();
    }

    // Check if we're on the issue details page
    if (window.location.pathname.includes('/views/issues/details.html')) {
        loadIssueDetails();
        setupIssueDetailsEvents();
    }

    // Check if we're on the issue create/edit page
    if (window.location.pathname.includes('/views/issues/create.html') ||
        window.location.pathname.includes('/views/issues/edit.html')) {

        setupIssueForm();

        // If edit page, load issue data
        if (window.location.pathname.includes('/views/issues/edit.html')) {
            loadIssueForEdit();
        }
    }
});

// Load all issues with optional filters
async function loadIssues(filters) {
    try {
        // Build query string for filters
        let queryString = '';
        if (filters) {
            const params = [];
            if (filters.projectId) params.push(`projectId=${filters.projectId}`);
            if (filters.status) params.push(`status=${filters.status}`);
            if (filters.priority) params.push(`priority=${filters.priority}`);
            if (filters.assigneeId) params.push(`assigneeId=${filters.assigneeId}`);
            if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
            if (params.length > 0) {
                queryString = `?${params.join('&')}`;
            }
        }

        const issues = await window.appHelpers.apiRequest(`/issues${queryString}`);
        if (!issues) return;

        const issuesTableBody = document.getElementById('issuesTableBody');
        if (!issuesTableBody) return;

        issuesTableBody.innerHTML = '';

        if (issues.length === 0) {
            issuesTableBody.innerHTML = '<tr><td colspan="8" class="text-center">No issues found</td></tr>';
            return;
        }

        issues.forEach(issue => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${issue.issueKey}</td>
                <td><a href="details.html?id=${issue.id}">${issue.title}</a></td>
                <td><a href="../project/details.html?id=${issue.project.id}">${issue.project.name}</a></td>
                <td>${getStatusBadge(issue.status)}</td>
                <td>${getPriorityBadge(issue.priority)}</td>
                <td>${issue.assignee ? issue.assignee.fullName : 'Unassigned'}</td>
                <td>${window.appHelpers.formatDate(issue.createdAt)}</td>
                <td>
                    <a href="details.html?id=${issue.id}" class="btn btn-info btn-sm" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="edit.html?id=${issue.id}" class="btn btn-warning btn-sm" title="Edit">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-danger btn-sm deleteIssue" data-id="${issue.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            issuesTableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.deleteIssue').forEach(button => {
            button.addEventListener('click', function() {
                const issueId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this issue?')) {
                    deleteIssue(issueId);
                }
            });
        });

        // Update pagination if applicable
        updatePagination(issues.totalPages, issues.currentPage);

    } catch (error) {
        console.error('Error loading issues:', error);
        window.appHelpers.showAlert('Failed to load issues. Please try again later.', 'danger');
    }
}

// Update pagination controls
function updatePagination(totalPages, currentPage) {
    const paginationElement = document.querySelector('.pagination');
    if (!paginationElement || !totalPages) return;

    // Default to page 1 if not specified
    currentPage = currentPage || 1;

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-disabled="${currentPage === 1}">Previous</a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-disabled="${currentPage === totalPages}">Next</a>
        </li>
    `;

    paginationElement.innerHTML = paginationHTML;

    // Add click event listeners
    document.querySelectorAll('.pagination .page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.getAttribute('aria-disabled') === 'true') return;

            const page = parseInt(this.getAttribute('data-page'));
            const currentFilters = getActiveFilters();
            currentFilters.page = page;

            loadIssues(currentFilters);
        });
    });
}

// Load issue details
async function loadIssueDetails() {
    try {
        const urlParams = window.appHelpers.getUrlParams();
        const issueId = urlParams.id;

        if (!issueId) {
            window.appHelpers.showAlert('No issue ID specified', 'danger');
            return;
        }

        const issue = await window.appHelpers.apiRequest(`/issues/${issueId}`);
        if (!issue) return;

        // Set page title
        document.title = `${issue.issueKey}: ${issue.title} - Project Management System`;

        // Populate issue details
        document.getElementById('issueTitle').textContent = issue.title;
        document.getElementById('issueProject').textContent = issue.project.name;
        document.getElementById('issueProject').href = `../project/details.html?id=${issue.project.id}`;
        document.getElementById('issueStatus').innerHTML = getStatusBadge(issue.status);
        document.getElementById('issuePriority').innerHTML = getPriorityBadge(issue.priority);
        document.getElementById('issueAssignedTo').textContent = issue.assignee ? issue.assignee.fullName : 'Unassigned';
        document.getElementById('issueCreatedDate').textContent = window.appHelpers.formatDate(issue.createdAt);
        document.getElementById('issueCreatedBy').textContent = issue.reporter ? issue.reporter.fullName : 'System';
        document.getElementById('issueDescription').textContent = issue.description || 'No description provided.';

        // If the issue has a sprint, display it
        const sprintElement = document.getElementById('issueSprint');
        if (sprintElement) {
            if (issue.sprint) {
                sprintElement.innerHTML = `<a href="../sprint/details.html?id=${issue.sprint.id}">${issue.sprint.name}</a>`;
            } else {
                sprintElement.textContent = 'Not assigned to any sprint';
            }
        }

        // If the issue has story points, display them
        const storyPointsElement = document.getElementById('issueStoryPoints');
        if (storyPointsElement) {
            storyPointsElement.textContent = issue.storyPoints || 'Not estimated';
        }

        // Load comments
        loadIssueComments(issue);

        // Load attachments if they exist
        if (issue.attachments && issue.attachments.length > 0) {
            loadAttachments(issue.attachments);
        }

        // Update status button visibility based on current status
        updateStatusButtons(issue.status);
    } catch (error) {
        console.error('Error loading issue details:', error);
        window.appHelpers.showAlert('Failed to load issue details. Please try again later.', 'danger');
    }
}

// Update status buttons visibility based on current status
function updateStatusButtons(currentStatus) {
    const statusButtons = document.querySelectorAll('.changeStatus');
    if (!statusButtons.length) return;

    statusButtons.forEach(button => {
        const status = button.getAttribute('data-status');

        // Hide the button that corresponds to current status
        if (status === currentStatus) {
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
        }
    });
}

// Load attachments
function loadAttachments(attachments) {
    const attachmentsContainer = document.getElementById('attachmentsContainer');
    if (!attachmentsContainer) return;

    if (attachments.length === 0) {
        attachmentsContainer.innerHTML = '<p class="text-muted">No attachments</p>';
        return;
    }

    attachmentsContainer.innerHTML = '';

    attachments.forEach(attachment => {
        const attachmentCard = document.createElement('div');
        attachmentCard.className = 'card mb-2';

        // Determine icon based on file type
        let fileIcon = 'fa-file';
        if (attachment.fileType) {
            if (attachment.fileType.includes('image')) fileIcon = 'fa-file-image';
            else if (attachment.fileType.includes('pdf')) fileIcon = 'fa-file-pdf';
            else if (attachment.fileType.includes('word')) fileIcon = 'fa-file-word';
            else if (attachment.fileType.includes('excel')) fileIcon = 'fa-file-excel';
            else if (attachment.fileType.includes('text')) fileIcon = 'fa-file-text';
            else if (attachment.fileType.includes('zip')) fileIcon = 'fa-file-archive';
        }

        attachmentCard.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas ${fileIcon} me-2"></i>
                        <a href="/epm/api/attachments/${attachment.id}/download" target="_blank">
                            ${attachment.fileName}
                        </a>
                    </div>
                    <div>
                        <small class="text-muted me-2">
                            Uploaded ${window.appHelpers.formatDate(attachment.uploadedAt)}
                        </small>
                        <button class="btn btn-sm btn-outline-danger deleteAttachment" data-id="${attachment.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        attachmentsContainer.appendChild(attachmentCard);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.deleteAttachment').forEach(button => {
        button.addEventListener('click', function() {
            const attachmentId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this attachment?')) {
                deleteAttachment(attachmentId);
            }
        });
    });
}

// Delete attachment
async function deleteAttachment(attachmentId) {
    try {
        const response = await window.appHelpers.apiRequest(`/attachments/${attachmentId}`, {
            method: 'DELETE'
        });

        if (response || response === null) {
            // Remove from UI
            const attachmentElement = document.querySelector(`.deleteAttachment[data-id="${attachmentId}"]`).closest('.card');
            attachmentElement.remove();

            window.appHelpers.showAlert('Attachment deleted successfully', 'success');

            // Check if there are no more attachments
            const attachmentsContainer = document.getElementById('attachmentsContainer');
            if (attachmentsContainer && attachmentsContainer.children.length === 0) {
                attachmentsContainer.innerHTML = '<p class="text-muted">No attachments</p>';
            }
        }
    } catch (error) {
        console.error('Error deleting attachment:', error);
        window.appHelpers.showAlert('Failed to delete attachment. Please try again later.', 'danger');
    }
}

// Load issue comments
async function loadIssueComments(issue) {
    try {
        const comments = await window.appHelpers.apiRequest(`/issues/${issue.id}/comments`);
        if (!comments) return;

        const commentsContainer = document.getElementById('commentsContainer');
        if (!commentsContainer) return;

        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="text-muted">No comments yet.</p>';
            return;
        }

        commentsContainer.innerHTML = '';

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'card mb-3';
            commentElement.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <img src="${comment.user.avatarUrl || '/epm/assets/img/avatar-placeholder.png'}" class="avatar-small me-2" alt="Avatar">
                        <span class="fw-bold">${comment.user.fullName || comment.user.username}</span>
                        <span class="text-muted ms-2">${window.appHelpers.formatDate(comment.createdAt)}</span>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-sm" type="button" id="commentOptions${comment.id}" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="commentOptions${comment.id}">
                            <li><a class="dropdown-item editComment" href="#" data-id="${comment.id}">Edit</a></li>
                            <li><a class="dropdown-item deleteComment" href="#" data-id="${comment.id}">Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${comment.content}</p>
                </div>
            `;

            commentsContainer.appendChild(commentElement);
        });

        // Add event listeners to comment actions
        document.querySelectorAll('.editComment').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const commentId = this.getAttribute('data-id');
                editComment(commentId);
            });
        });

        document.querySelectorAll('.deleteComment').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const commentId = this.getAttribute('data-id');
                deleteComment(commentId);
            });
        });
    } catch (error) {
        console.error('Error loading issue comments:', error);
        window.appHelpers.showAlert('Failed to load comments. Please try again later.', 'danger');
    }
}

// Load issue for editing
async function loadIssueForEdit() {
    try {
        const urlParams = window.appHelpers.getUrlParams();
        const issueId = urlParams.id;

        if (!issueId) {
            window.appHelpers.showAlert('No issue ID specified', 'danger');
            return;
        }

        const issue = await window.appHelpers.apiRequest(`/issues/${issueId}`);
        if (!issue) return;

        // Set page title
        document.title = `Edit ${issue.issueKey}: ${issue.title} - Project Management System`;

        // Populate form fields
        document.getElementById('issueTitle').value = issue.title;

        // We'll set these after loading dropdowns
        window.issueProjectId = issue.project.id;
        window.issueAssigneeId = issue.assignee ? issue.assignee.id : null;
        window.issueStatusId = issue.status;
        window.issuePriorityId = issue.priority;
        window.issueTypeId = issue.type;
        window.issueSprintId = issue.sprint ? issue.sprint.id : null;

        document.getElementById('issueDescription').value = issue.description || '';

        if (issue.storyPoints) {
            document.getElementById('issueStoryPoints').value = issue.storyPoints;
        }

        if (issue.dueDate) {
            document.getElementById('issueDueDate').value = issue.dueDate.split('T')[0];
        }

        // Load existing attachments
        if (issue.attachments && issue.attachments.length > 0) {
            const attachmentsContainer = document.getElementById('existingAttachments');
            if (attachmentsContainer) {
                attachmentsContainer.innerHTML = '';

                issue.attachments.forEach(attachment => {
                    const attachmentRow = document.createElement('div');
                    attachmentRow.className = 'card mb-2';
                    attachmentRow.innerHTML = `
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="fas fa-file me-2"></i>
                                    ${attachment.fileName}
                                </div>
                                <button class="btn btn-sm btn-outline-danger removeAttachment" data-id="${attachment.id}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    `;

                    attachmentsContainer.appendChild(attachmentRow);
                });

                // Add event listeners
                document.querySelectorAll('.removeAttachment').forEach(button => {
                    button.addEventListener('click', function() {
                        const attachmentId = this.getAttribute('data-id');
                        if (confirm('Are you sure you want to remove this attachment?')) {
                            this.closest('.card').remove();
                            window.removedAttachments = window.removedAttachments || [];
                            window.removedAttachments.push(attachmentId);
                        }
                    });
                });
            }
        }
    } catch (error) {
        console.error('Error loading issue for edit:', error);
        window.appHelpers.showAlert('Failed to load issue details. Please try again later.', 'danger');
    }
}

// Setup issue form
async function setupIssueForm() {
    try {
        console.log("Setting up issue form");

        // Fallback projects data
        const fallbackProjects = [
            { id: 1, name: "Sample Project" }
        ];

        // Load projects
        const projectsResponse = await window.appHelpers.apiRequest('/projects');
        const projects = projectsResponse?.projects || fallbackProjects;

        console.log("Projects loaded:", projects);

        // Populate project select
        const projectSelect = document.getElementById('issueProject');
        if (projectSelect) {
            projectSelect.innerHTML = '<option value="">Select Project</option>';

            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                projectSelect.appendChild(option);

                // If editing and this is the project
                if (window.issueProjectId && window.issueProjectId == project.id) {
                    option.selected = true;
                    // Trigger project change to load team members
                    projectSelect.dispatchEvent(new Event('change'));
                }
            });

            // Add change event to load project members
            projectSelect.addEventListener('change', loadProjectMembers);
        }

        // Setup issue type, status, priority
        setupIssueTypeDropdown();
        setupIssueStatusDropdown();
        setupIssuePriorityDropdown();

        // Setup form submission
        const issueForm = document.getElementById('issueForm');
        if (issueForm) {
            issueForm.addEventListener('submit', submitIssueForm);
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

        // Initialize attachment upload preview
        initializeAttachmentPreview();

        console.log("Issue form setup complete");
    } catch (error) {
        console.error('Error setting up issue form:', error);
        window.appHelpers.showAlert('Failed to load form data. Please try again later.', 'danger');
    }
}


// Initialize attachment upload preview
function initializeAttachmentPreview() {
    const fileInput = document.getElementById('issueAttachments');
    const previewContainer = document.getElementById('attachmentPreview');

    if (!fileInput || !previewContainer) return;

    fileInput.addEventListener('change', function() {
        previewContainer.innerHTML = '';

        if (this.files.length === 0) {
            previewContainer.style.display = 'none';
            return;
        }

        previewContainer.style.display = 'block';

        Array.from(this.files).forEach(file => {
            const filePreview = document.createElement('div');
            filePreview.className = 'card mb-2';
            filePreview.innerHTML = `
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-file me-2"></i>
                            ${file.name}
                        </div>
                        <small class="text-muted">${formatFileSize(file.size)}</small>
                    </div>
                </div>
            `;

            previewContainer.appendChild(filePreview);
        });
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function loadProjectMembers() {
    try {
        const projectId = document.getElementById('issueProject').value;
        if (!projectId) return;

        // Fallback users data
        const fallbackUsers = [
            { id: 1, fullName: 'Sample User', username: 'user1' }
        ];

        // Fetch project details with team members
        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);
        const members = project?.members || fallbackUsers;

        // Populate assignee select
        const assigneeSelect = document.getElementById('issueAssignee');
        if (assigneeSelect) {
            assigneeSelect.innerHTML = '<option value="">Unassigned</option>';

            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.fullName || member.username;
                assigneeSelect.appendChild(option);

                // If editing and this is the assignee
                if (window.issueAssigneeId && window.issueAssigneeId == member.id) {
                    option.selected = true;
                }
            });
        }

        // Load project sprints
        await loadProjectSprints(projectId);
    } catch (error) {
        console.error('Error loading project members:', error);
        window.appHelpers.showAlert('Failed to load project members. Please try again later.', 'danger');
    }
}


















// Load project members
async function loadProjectMembers() {
    try {
        const projectId = document.getElementById('issueProject').value;
        if (!projectId) return;

        // Fallback users data
        const fallbackUsers = [
            { id: 1, fullName: 'Sample User', username: 'user1' }
        ];

        // Fetch project details with team members
        const project = await window.appHelpers.apiRequest(`/projects/${projectId}`);
        const members = project?.members || fallbackUsers;

        // Populate assignee select
        const assigneeSelect = document.getElementById('issueAssignee');
        if (assigneeSelect) {
            assigneeSelect.innerHTML = '<option value="">Unassigned</option>';

            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.fullName || member.username;
                assigneeSelect.appendChild(option);

                // If editing and this is the assignee
                if (window.issueAssigneeId && window.issueAssigneeId == member.id) {
                    option.selected = true;
                }
            });
        }

        // Load project sprints
        await loadProjectSprints(projectId);
    } catch (error) {
        console.error('Error loading project members:', error);
        window.appHelpers.showAlert('Failed to load project members. Please try again later.', 'danger');
    }
}

// Load project sprints
async function loadProjectSprints(projectId) {
    try {
        // Fallback sprints data
        const fallbackSprints = [
            { id: 1, name: "Sample Sprint" }
        ];

        const sprints = await window.appHelpers.apiRequest(`/projects/${projectId}/sprints`);
        const sprintList = sprints?.sprints || fallbackSprints;

        // Populate sprint select
        const sprintSelect = document.getElementById('issueSprint');
        if (sprintSelect) {
            sprintSelect.innerHTML = '<option value="">Backlog (No Sprint)</option>';

            sprintList.forEach(sprint => {
                const option = document.createElement('option');
                option.value = sprint.id;
                option.textContent = sprint.name;
                sprintSelect.appendChild(option);

                // If editing and this is the sprint
                if (window.issueSprintId && window.issueSprintId == sprint.id) {
                    option.selected = true;
                }
            });
        }
    } catch (error) {
        console.error('Error loading project sprints:', error);
        // Not critical, just log the error
    }
}

// Setup issue type dropdown
function setupIssueTypeDropdown() {
    const typeSelect = document.getElementById('issueType');
    if (!typeSelect) return;

    typeSelect.innerHTML = `
        <option value="">Select Type</option>
        <option value="STORY">Story</option>
        <option value="BUG">Bug</option>
        <option value="TASK">Task</option>
        <option value="EPIC">Epic</option>
    `;

    // If editing, set selected
    if (window.issueTypeId) {
        typeSelect.value = window.issueTypeId;
    }
}

// Setup issue status dropdown
function setupIssueStatusDropdown() {
    const statusSelect = document.getElementById('issueStatus');
    if (!statusSelect) return;

    statusSelect.innerHTML = `
        <option value="">Select Status</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="DONE">Done</option>
    `;

    // If editing, set selected
    if (window.issueStatusId) {
        statusSelect.value = window.issueStatusId;
    } else {
        // Default to TODO for new issues
        statusSelect.value = 'TODO';
    }
}

// Setup issue priority dropdown
function setupIssuePriorityDropdown() {
    const prioritySelect = document.getElementById('issuePriority');
    if (!prioritySelect) return;

    prioritySelect.innerHTML = `
        <option value="">Select Priority</option>
        <option value="HIGHEST">Highest</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
        <option value="LOWEST">Lowest</option>
    `;

    // If editing, set selected
    if (window.issuePriorityId) {
        prioritySelect.value = window.issuePriorityId;
    } else {
        // Default to MEDIUM for new issues
        prioritySelect.value = 'MEDIUM';
    }
}

// Submit issue form
async function submitIssueForm(e) {
    e.preventDefault();

    // Get form data
    const issueId = new URLSearchParams(window.location.search).get('id');
    const issueTitle = document.getElementById('issueTitle').value;
    const issueProject = document.getElementById('issueProject').value;
    const issueType = document.getElementById('issueType').value;
    const issueStatus = document.getElementById('issueStatus').value;
    const issuePriority = document.getElementById('issuePriority').value;
    const issueAssignee = document.getElementById('issueAssignee').value;
    const issueSprint = document.getElementById('issueSprint')?.value;
    const issueStoryPoints = document.getElementById('issueStoryPoints')?.value;
    const issueDueDate = document.getElementById('issueDueDate')?.value;
    const issueDescription = document.getElementById('issueDescription').value;
    const issueAttachments = document.getElementById('issueAttachments')?.files;

    // Validate form
    if (!issueTitle || !issueProject || !issueType || !issueStatus || !issuePriority) {
        window.appHelpers.showAlert('Please fill in all required fields', 'danger');
        return;
    }

    // Create form data if we have attachments
    let formData = null;
    let hasAttachments = issueAttachments && issueAttachments.length > 0;

    if (hasAttachments) {
        formData = new FormData();
        formData.append('title', issueTitle);
        formData.append('projectId', issueProject);
        formData.append('type', issueType);
        formData.append('status', issueStatus);
        formData.append('priority', issuePriority);
        formData.append('description', issueDescription);

        if (issueAssignee) formData.append('assigneeId', issueAssignee);
        if (issueSprint) formData.append('sprintId', issueSprint);
        if (issueStoryPoints) formData.append('storyPoints', issueStoryPoints);
        if (issueDueDate) formData.append('dueDate', issueDueDate + 'T00:00:00');

        // Add removed attachments if any
        if (window.removedAttachments && window.removedAttachments.length > 0) {
            window.removedAttachments.forEach(attachId => {
                formData.append('removeAttachments', attachId);
            });
        }

        // Add files
        for (let i = 0; i < issueAttachments.length; i++) {
            formData.append('attachments', issueAttachments[i]);
        }
    } else {
        // Create issue data as JSON
        const issueData = {
            title: issueTitle,
            project: { id: issueProject },
            type: issueType,
            status: issueStatus,
            priority: issuePriority,
            description: issueDescription
        };

        // Add optional fields if present
        if (issueAssignee) {
            issueData.assignee = { id: issueAssignee };
        }

        if (issueSprint) {
            issueData.sprint = { id: issueSprint };
        }

        if (issueStoryPoints) {
            issueData.storyPoints = parseInt(issueStoryPoints);
        }

        if (issueDueDate) {
            issueData.dueDate = issueDueDate + 'T00:00:00';
        }

        // Add removed attachments if any
        if (window.removedAttachments && window.removedAttachments.length > 0) {
            issueData.removeAttachments = window.removedAttachments;
        }
    }

    try {
        let response;
        let options = {
            method: issueId ? 'PUT' : 'POST'
        };

        // Set appropriate content type and body based on whether we're using formData
        if (hasAttachments) {
            options.body = formData;
            // Let browser set the correct content type with boundary
        } else {
            options.body = JSON.stringify(issueData);
            options.headers = {
                'Content-Type': 'application/json'
            };
        }

        if (issueId) {
            // Update existing issue
            response = await window.appHelpers.apiRequest(`/issues/${issueId}`, options);

            if (response) {
                window.appHelpers.showAlert('Issue updated successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${issueId}`;
                }, 1500);
            }
        } else {
            // Create new issue
            response = await window.appHelpers.apiRequest('/issues', options);

            if (response) {
                window.appHelpers.showAlert('Issue created successfully', 'success');
                setTimeout(() => {
                    window.location.href = `details.html?id=${response.id}`;
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Error saving issue:', error);
        window.appHelpers.showAlert('Failed to save issue. Please try again later.', 'danger');
    }
}

// Setup issue details events
function setupIssueDetailsEvents() {
    // Add comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', addComment);
    }

    // Delete issue button
    const deleteIssueBtn = document.getElementById('deleteIssueBtn');
    if (deleteIssueBtn) {
        deleteIssueBtn.addEventListener('click', function() {
            const issueId = new URLSearchParams(window.location.search).get('id');
            if (confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
                deleteIssue(issueId);
            }
        });
    }

    // Change status buttons
    document.querySelectorAll('.changeStatus').forEach(button => {
        button.addEventListener('click', function() {
            const issueId = new URLSearchParams(window.location.search).get('id');
            const status = this.getAttribute('data-status');
            updateIssueStatus(issueId, status);
        });
    });

    // Add attachment button
    const addAttachmentBtn = document.getElementById('addAttachmentBtn');
    if (addAttachmentBtn) {
        addAttachmentBtn.addEventListener('click', function() {
            document.getElementById('attachmentUpload').click();
        });

        // Handle file selection and upload
        const attachmentUpload = document.getElementById('attachmentUpload');
        if (attachmentUpload) {
            attachmentUpload.addEventListener('change', function() {
                if (this.files.length > 0) {
                    uploadAttachment();
                }
            });
        }
    }
}

// Upload attachment to issue
async function uploadAttachment() {
    const issueId = new URLSearchParams(window.location.search).get('id');
    const fileInput = document.getElementById('attachmentUpload');

    if (!fileInput || !fileInput.files.length) return;

    const formData = new FormData();

    // Add all selected files
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('attachments', fileInput.files[i]);
    }

    try {
        // Show loading indicator
        window.appHelpers.showAlert('Uploading attachment...', 'info');

        const response = await window.appHelpers.apiRequest(`/issues/${issueId}/attachments`, {
            method: 'POST',
            body: formData
        });

        if (response) {
            window.appHelpers.showAlert('Attachment uploaded successfully', 'success');

            // Reload issue details to show the new attachment
            const issue = await window.appHelpers.apiRequest(`/issues/${issueId}`);
            if (issue && issue.attachments) {
                loadAttachments(issue.attachments);
            }

            // Clear the file input
            fileInput.value = '';
        }
    } catch (error) {
        console.error('Error uploading attachment:', error);
        window.appHelpers.showAlert('Failed to upload attachment. Please try again later.', 'danger');
    }
}

// Add comment
async function addComment(e) {
    e.preventDefault();

    const issueId = new URLSearchParams(window.location.search).get('id');
    const commentText = document.getElementById('commentText').value;

    if (!commentText.trim()) {
        window.appHelpers.showAlert('Please enter a comment', 'warning');
        return;
    }

    try {
        const response = await window.appHelpers.apiRequest(`/issues/${issueId}/comments`, {
            method: 'POST',
            body: JSON.stringify({
                content: commentText
            })
        });

        if (response) {
            window.appHelpers.showAlert('Comment added successfully', 'success');
            // Reload the comments
            const issue = await window.appHelpers.apiRequest(`/issues/${issueId}`);
            if (issue) {
                loadIssueComments(issue);
                // Clear the form
                document.getElementById('commentText').value = '';
            }
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        window.appHelpers.showAlert('Failed to add comment. Please try again later.', 'danger');
    }
}

// Edit comment
async function editComment(commentId) {
    try {
        // Get the comment from the UI
        const commentElement = document.querySelector(`.editComment[data-id="${commentId}"]`).closest('.card');
        const commentTextElement = commentElement.querySelector('.card-text');
        const currentText = commentTextElement.textContent;

        // Prompt for new text
        const newText = prompt('Edit your comment:', currentText);
        if (newText && newText !== currentText) {
            // Update in the API
            const response = await window.appHelpers.apiRequest(`/comments/${commentId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: newText
                })
            });

            if (response) {
                // Update in the UI
                commentTextElement.textContent = newText;
                window.appHelpers.showAlert('Comment updated successfully', 'success');
            }
        }
    } catch (error) {
        console.error('Error editing comment:', error);
        window.appHelpers.showAlert('Failed to edit comment. Please try again later.', 'danger');
    }
}

// Delete comment
async function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            const response = await window.appHelpers.apiRequest(`/comments/${commentId}`, {
                method: 'DELETE'
            });

            // Remove from UI
            const commentElement = document.querySelector(`.deleteComment[data-id="${commentId}"]`).closest('.card');
            commentElement.remove();

            window.appHelpers.showAlert('Comment deleted successfully', 'success');

            // Check if there are no more comments
            const commentsContainer = document.getElementById('commentsContainer');
            if (commentsContainer && commentsContainer.children.length === 0) {
                commentsContainer.innerHTML = '<p class="text-muted">No comments yet.</p>';
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            window.appHelpers.showAlert('Failed to delete comment. Please try again later.', 'danger');
        }
    }
}

// Update issue status
async function updateIssueStatus(issueId, status) {
    try {
        const response = await window.appHelpers.apiRequest(`/issues/${issueId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                status: status
            })
        });

        if (response) {
            // Update status badge
            document.getElementById('issueStatus').innerHTML = getStatusBadge(status);
            window.appHelpers.showAlert(`Issue status updated to ${getStatusDisplayName(status)}`, 'success');

            // Update visible status buttons
            updateStatusButtons(status);
        }
    } catch (error) {
        console.error('Error updating issue status:', error);
        window.appHelpers.showAlert('Failed to update issue status. Please try again later.', 'danger');
    }
}

// Get status display name
function getStatusDisplayName(status) {
    switch(status) {
        case 'TODO': return 'To Do';
        case 'IN_PROGRESS': return 'In Progress';
        case 'IN_REVIEW': return 'In Review';
        case 'DONE': return 'Done';
        default: return status;
    }
}

// Delete issue
async function deleteIssue(issueId) {
    try {
        const response = await window.appHelpers.apiRequest(`/issues/${issueId}`, {
            method: 'DELETE'
        });

        window.appHelpers.showAlert('Issue deleted successfully', 'success');

        // If on details page, redirect to list
        if (window.location.pathname.includes('/views/issues/details.html')) {
            setTimeout(() => {
                window.location.href = 'list.html';
            }, 1500);
        } else {
            // If on list page, remove row
            const row = document.querySelector(`.deleteIssue[data-id="${issueId}"]`).closest('tr');
            row.remove();
        }
    } catch (error) {
        console.error('Error deleting issue:', error);
        window.appHelpers.showAlert('Failed to delete issue. Please try again later.', 'danger');
    }
}

// Setup issues list filters
function setupIssuesListFilters() {
    // First, load filter options (projects, assignees)
    loadFilterOptions();

    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get filter values
            const filters = getActiveFilters();

            // Apply filters
            loadIssues(filters);
        });
    }

    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            // Reload issues
            loadIssues();
        });
    }

    // Setup search functionality
    const searchInput = document.getElementById('searchIssues');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const filters = getActiveFilters();
                filters.search = this.value;
                loadIssues(filters);
            }
        });

        // Add search button handler
        const searchBtn = searchInput.parentElement.querySelector('button');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const filters = getActiveFilters();
                filters.search = searchInput.value;
                loadIssues(filters);
            });
        }
    }
}

// Load filter options
async function loadFilterOptions() {
    try {
        // Load projects for filter
        const projects = await window.appHelpers.apiRequest('/projects');
        if (projects) {
            const projectFilter = document.getElementById('projectFilter');
            if (projectFilter) {
                projectFilter.innerHTML = '<option value="">All Projects</option>';

                projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.name;
                    projectFilter.appendChild(option);
                });
            }
        }

        // Load users for assignee filter
        const users = await window.appHelpers.apiRequest('/users');
        if (users) {
            const assigneeFilter = document.getElementById('assigneeFilter');
            if (assigneeFilter) {
                // Keep special options
                const defaultOptions = assigneeFilter.innerHTML;
                assigneeFilter.innerHTML = defaultOptions;

                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.fullName || user.username;
                    assigneeFilter.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading filter options:', error);
    }
}

// Get active filters from the form
function getActiveFilters() {
    const filters = {};

    const projectFilter = document.getElementById('projectFilter');
    if (projectFilter && projectFilter.value) {
        filters.projectId = projectFilter.value;
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value) {
        filters.status = statusFilter.value;
    }

    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter && priorityFilter.value) {
        filters.priority = priorityFilter.value;
    }

    const assigneeFilter = document.getElementById('assigneeFilter');
    if (assigneeFilter && assigneeFilter.value) {
        if (assigneeFilter.value === 'me') {
            filters.assignedToMe = true;
        } else if (assigneeFilter.value === 'unassigned') {
            filters.unassigned = true;
        } else {
            filters.assigneeId = assigneeFilter.value;
        }
    }

    const searchInput = document.getElementById('searchIssues');
    if (searchInput && searchInput.value.trim()) {
        filters.search = searchInput.value.trim();
    }

    return filters;
}

// Helper functions
function getStatusBadge(status) {
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