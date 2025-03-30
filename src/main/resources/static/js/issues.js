// issues.js - Handles all issues-related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!checkAuth()) return;

    // Check if we're on the issues list page
    if (window.location.pathname.includes('/views/issues/list.html')) {
        loadIssues();
        setupIssueListEventListeners();
    }

    // Check if we're on the issue details page
    if (window.location.pathname.includes('/views/issues/details.html')) {
        loadIssueDetails();
        setupIssueDetailsEventListeners();
    }

    // Check if we're on the issue create/edit page
    if (window.location.pathname.includes('/views/issues/create.html') ||
        window.location.pathname.includes('/views/issues/edit.html')) {
        setupIssueFormEventListeners();
        loadProjectsDropdown();

        // If edit page, load issue data
        if (window.location.pathname.includes('/views/issues/edit.html')) {
            loadIssueForEdit();
        }
    }
});

// Load all issues
function loadIssues() {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const issues = getMockIssues();

    const issuesTableBody = document.getElementById('issuesTableBody');
    if (!issuesTableBody) return;

    issuesTableBody.innerHTML = '';

    issues.forEach(issue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${issue.id}</td>
            <td><a href="details.html?id=${issue.id}">${issue.title}</a></td>
            <td><a href="../project/details.html?id=${issue.projectId}">${getProjectNameById(issue.projectId)}</a></td>
            <td>${getStatusBadge(issue.status)}</td>
            <td>${getPriorityBadge(issue.priority)}</td>
            <td>${issue.assignedTo}</td>
            <td>${formatDate(issue.createdDate)}</td>
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
            deleteIssue(issueId);
        });
    });
}

// Load issue details
function loadIssueDetails() {
    // Get issue ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');

    if (!issueId) {
        showAlert('No issue ID specified', 'danger');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const issue = getMockIssueById(issueId);

    if (!issue) {
        showAlert('Issue not found', 'danger');
        return;
    }

    // Set page title
    document.title = `${issue.title} - Project Management System`;

    // Populate issue details
    document.getElementById('issueTitle').textContent = issue.title;
    document.getElementById('issueProject').textContent = getProjectNameById(issue.projectId);
    document.getElementById('issueProject').href = `../project/details.html?id=${issue.projectId}`;
    document.getElementById('issueStatus').innerHTML = getStatusBadge(issue.status);
    document.getElementById('issuePriority').innerHTML = getPriorityBadge(issue.priority);
    document.getElementById('issueAssignedTo').textContent = issue.assignedTo;
    document.getElementById('issueCreatedDate').textContent = formatDate(issue.createdDate);
    document.getElementById('issueCreatedBy').textContent = issue.createdBy || 'System';
    document.getElementById('issueDescription').textContent = issue.description || 'No description provided.';

    // Load comments
    loadIssueComments(issueId);
}

// Load issue for editing
function loadIssueForEdit() {
    // Get issue ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');

    if (!issueId) {
        showAlert('No issue ID specified', 'danger');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const issue = getMockIssueById(issueId);

    if (!issue) {
        showAlert('Issue not found', 'danger');
        return;
    }

    // Set page title
    document.title = `Edit Issue - Project Management System`;

    // Populate form fields
    document.getElementById('issueTitle').value = issue.title;
    document.getElementById('issueProject').value = issue.projectId;
    document.getElementById('issueStatus').value = issue.status;
    document.getElementById('issuePriority').value = issue.priority;
    document.getElementById('issueAssignedTo').value = issue.assignedTo;
    document.getElementById('issueDescription').value = issue.description || '';
}

// Load issue comments
function loadIssueComments(issueId) {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const comments = getMockComments(issueId);

    const commentsContainer = document.getElementById('commentsContainer');
    if (!commentsContainer) return;

    commentsContainer.innerHTML = '';

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="text-muted">No comments yet.</p>';
        return;
    }

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'card mb-3';
        commentElement.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <img src="../../assets/img/avatar-placeholder.png" class="avatar-small me-2" alt="Avatar">
                    <span class="fw-bold">${comment.author}</span>
                    <span class="text-muted ms-2">${formatDate(comment.date)}</span>
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
                <p class="card-text">${comment.text}</p>
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
}

// Load projects dropdown
function loadProjectsDropdown() {
    const projectSelect = document.getElementById('issueProject');
    if (!projectSelect) return;

    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    const projects = getMockProjects();

    projectSelect.innerHTML = '<option value="">Select Project</option>';

    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
}

// Setup event listeners for issue list page
function setupIssueListEventListeners() {
    // Filter form
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would filter the issues
            showAlert('Filters applied', 'success');
        });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            filterForm.reset();
            // In a real app, this would reset the filters and reload all issues
            showAlert('Filters cleared', 'info');
        });
    }

    // Search input
    const searchInput = document.getElementById('searchIssues');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // In a real app, this would filter the issues as you type
            // For demo purposes, we'll just add a small delay
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // Filter issues
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.length > 2) {
                    showAlert(`Searching for: ${searchTerm}`, 'info');
                }
            }, 500);
        });
    }
}

// Setup event listeners for issue details page
function setupIssueDetailsEventListeners() {
    // Change status buttons
    document.querySelectorAll('.changeStatus').forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            updateIssueStatus(status);
        });
    });

    // Add comment form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addComment();
        });
    }

    // Delete issue button
    const deleteIssueBtn = document.getElementById('deleteIssueBtn');
    if (deleteIssueBtn) {
        deleteIssueBtn.addEventListener('click', function() {
            const issueId = new URLSearchParams(window.location.search).get('id');
            deleteIssue(issueId);
        });
    }
}

// Setup event listeners for issue form page
function setupIssueFormEventListeners() {
    // Form submission
    const issueForm = document.getElementById('issueForm');
    if (issueForm) {
        issueForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const issueTitle = document.getElementById('issueTitle').value;
            const issueProject = document.getElementById('issueProject').value;
            const issueStatus = document.getElementById('issueStatus').value;
            const issuePriority = document.getElementById('issuePriority').value;
            const issueAssignedTo = document.getElementById('issueAssignedTo').value;
            const issueDescription = document.getElementById('issueDescription').value;

            // Validate form
            if (!issueTitle || !issueProject || !issueStatus || !issuePriority) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }

            // In a real app, this would be an API call to save the issue
            // For demo purposes, we'll just show a success message and redirect

            showAlert('Issue saved successfully', 'success');

            // Redirect to issue list after a delay
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

// Update issue status
function updateIssueStatus(status) {
    // Get issue ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');

    if (!issueId) return;

    // In a real app, this would be an API call
    // For demo purposes, we'll just update the UI
    document.getElementById('issueStatus').innerHTML = getStatusBadge(status);

    showAlert(`Issue status updated to ${status}`, 'success');
}

// Add comment
function addComment() {
    const commentText = document.getElementById('commentText').value;
    if (!commentText) {
        showAlert('Please enter a comment', 'warning');
        return;
    }

    // Get issue ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const issueId = urlParams.get('id');

    if (!issueId) return;

    // In a real app, this would be an API call
    // For demo purposes, we'll just add it to the UI

    const commentsContainer = document.getElementById('commentsContainer');
    const commentElement = document.createElement('div');
    commentElement.className = 'card mb-3';

    // Get user from localStorage (in a real app, this would come from the session)
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    commentElement.innerHTML = `
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <img src="../../assets/img/avatar-placeholder.png" class="avatar-small me-2" alt="Avatar">
                <span class="fw-bold">${user.name}</span>
                <span class="text-muted ms-2">Just now</span>
            </div>
            <div class="dropdown">
                <button class="btn btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item editComment" href="#" data-id="new">Edit</a></li>
                    <li><a class="dropdown-item deleteComment" href="#" data-id="new">Delete</a></li>
                </ul>
            </div>
        </div>
        <div class="card-body">
            <p class="card-text">${commentText}</p>
        </div>
    `;

    // Check if the commentsContainer is empty with just the "No comments yet" message
    if (commentsContainer.textContent.trim() === 'No comments yet.') {
        commentsContainer.innerHTML = '';
    }

    commentsContainer.prepend(commentElement);

    // Clear textarea
    document.getElementById('commentText').value = '';

    showAlert('Comment added successfully', 'success');

    // Add event listeners to new comment
    commentElement.querySelector('.editComment').addEventListener('click', function(e) {
        e.preventDefault();
        editComment('new');
    });

    commentElement.querySelector('.deleteComment').addEventListener('click', function(e) {
        e.preventDefault();
        deleteComment('new');
    });
}

// Edit comment
function editComment(commentId) {
    // In a real app, this would retrieve the comment and show a modal
    // For demo purposes, we'll use a prompt
    const commentElement = document.querySelector(`.editComment[data-id="${commentId}"]`).closest('.card');
    const commentTextElement = commentElement.querySelector('.card-text');
    const currentText = commentTextElement.textContent;

    const newText = prompt('Edit your comment:', currentText);
    if (newText && newText !== currentText) {
        commentTextElement.textContent = newText;
        showAlert('Comment updated successfully', 'success');
    }
}

// Delete comment
function deleteComment(commentId) {
    if (confirm('Are you sure you want to delete this comment?')) {
        // In a real app, this would be an API call
        const commentElement = document.querySelector(`.deleteComment[data-id="${commentId}"]`).closest('.card');
        commentElement.remove();

        // Check if there are no more comments
        const commentsContainer = document.getElementById('commentsContainer');
        if (commentsContainer.children.length === 0) {
            commentsContainer.innerHTML = '<p class="text-muted">No comments yet.</p>';
        }

        showAlert('Comment deleted successfully', 'success');
    }
}

// Delete issue
function deleteIssue(issueId) {
    if (confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
        // In a real app, this would be an API call

        // Check if we're on the details page
        if (window.location.pathname.includes('/views/issues/details.html')) {
            // Redirect to issues list
            showAlert('Issue deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'list.html';
            }, 1500);
        } else {
            // Remove row from table
            const button = document.querySelector(`.deleteIssue[data-id="${issueId}"]`);
            if (button) {
                button.closest('tr').remove();
                showAlert('Issue deleted successfully', 'success');
            }
        }
    }
}

// Utility function to get project name by ID
function getProjectNameById(projectId) {
    const projects = getMockProjects();
    const project = projects.find(p => p.id == projectId);
    return project ? project.name : 'Unknown Project';
}

// Mock data functions
function getMockIssues() {
    return [
        {
            id: 1,
            title: 'Login page UI improvement',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdDate: '2023-02-10',
            createdBy: 'John Doe',
            description: 'The login page needs UI improvements to match the new design system. Update colors, spacing, and form elements.'
        },
        {
            id: 2,
            title: 'Database connection error',
            projectId: 3,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Bob Johnson',
            createdDate: '2023-02-15',
            createdBy: 'Mike Johnson',
            description: 'Users occasionally experience database connection errors during peak hours. Need to investigate and fix the issue.'
        },
        {
            id: 3,
            title: 'Add export to PDF feature',
            projectId: 1,
            status: 'Resolved',
            priority: 'Low',
            assignedTo: 'Alice Williams',
            createdDate: '2023-03-01',
            createdBy: 'John Doe',
            description: 'Add the ability to export reports to PDF format for offline viewing and sharing.'
        },
        {
            id: 4,
            title: 'API integration not working',
            projectId: 2,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Mike Johnson',
            createdDate: '2023-03-05',
            createdBy: 'Jane Smith',
            description: 'The integration with the payment API is failing. Transactions are not being processed correctly.'
        },
        {
            id: 5,
            title: 'Optimize image loading',
            projectId: 1,
            status: 'In Progress',
            priority: 'Medium',
            assignedTo: 'John Doe',
            createdDate: '2023-03-10',
            createdBy: 'Alice Williams',
            description: 'Images on the main dashboard are loading slowly. Need to implement lazy loading and image optimization.'
        },
        {
            id: 6,
            title: 'Fix responsive layout on mobile',
            projectId: 1,
            status: 'Open',
            priority: 'Medium',
            assignedTo: 'Jane Smith',
            createdDate: '2023-03-15',
            createdBy: 'Bob Johnson',
            description: 'The layout is broken on mobile devices. Elements are overlapping and text is cut off.'
        },
        {
            id: 7,
            title: 'Implement user roles and permissions',
            projectId: 4,
            status: 'Open',
            priority: 'High',
            assignedTo: 'Mike Johnson',
            createdDate: '2023-03-20',
            createdBy: 'Sarah Williams',
            description: 'Create a role-based access control system to manage user permissions.'
        },
        {
            id: 8,
            title: 'Fix memory leak in application',
            projectId: 2,
            status: 'In Progress',
            priority: 'High',
            assignedTo: 'Bob Johnson',
            createdDate: '2023-03-25',
            createdBy: 'Mike Johnson',
            description: 'The application is using excessive memory over time, leading to poor performance. Need to identify and fix the memory leak.'
        }
    ];
}

function getMockIssueById(id) {
    return getMockIssues().find(issue => issue.id == id);
}

function getMockComments(issueId) {
    // In a real app, this would filter comments by issue ID
    // For demo purposes, we'll return some mock comments
    if (issueId == 1) {
        return [
            {
                id: 1,
                author: 'John Doe',
                date: '2023-02-12',
                text: 'I\'ve started working on this. Will update the design according to the new style guide.'
            },
            {
                id: 2,
                author: 'Jane Smith',
                date: '2023-02-14',
                text: 'I\'ve made progress on the login form. New input styles and button designs are implemented.'
            },
            {
                id: 3,
                author: 'Mike Johnson',
                date: '2023-02-18',
                text: 'The design looks good! Just need to fix the spacing between the inputs and the submit button.'
            }
        ];
    } else if (issueId == 2) {
        return [
            {
                id: 4,
                author: 'Bob Johnson',
                date: '2023-02-16',
                text: 'I\'m investigating this issue. It seems to happen when there are more than 100 concurrent users.'
            },
            {
                id: 5,
                author: 'Mike Johnson',
                date: '2023-02-17',
                text: 'Have you checked the connection pool settings? We might need to increase the maximum connections.'
            }
        ];
    } else if (issueId == 3) {
        return [
            {
                id: 6,
                author: 'Alice Williams',
                date: '2023-03-02',
                text: 'I\'ve implemented the PDF export feature using jsPDF library. It works for basic reports.'
            },
            {
                id: 7,
                author: 'John Doe',
                date: '2023-03-03',
                text: 'Great work! I\'ve tested it and it works perfectly. Closing this issue.'
            }
        ];
    }

    // Return empty array for other issues
    return [];
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