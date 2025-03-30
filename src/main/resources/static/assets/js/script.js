// Main JavaScript file for common functionality

document.addEventListener('DOMContentLoaded', function() {
    // Setup global event listeners
    setupGlobalListeners();

    // Initialize tooltips
    initTooltips();

    // Initialize popovers
    initPopovers();

    // Check for alert messages in URL
    checkForAlertMessages();
});

// Initialize Bootstrap tooltips
function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Bootstrap popovers
function initPopovers() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Setup global event listeners
function setupGlobalListeners() {
    // Dark/Light mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

// Toggle dark/light mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    // In a real application, this would make an API call to invalidate the session
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/views/auth/login.html';
}

// Handle search
function handleSearch(e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // In a real application, this would redirect to search results or filter content
        // For demo purposes, just show an alert
        showAlert(`Searching for: ${searchTerm}`, 'info');
    }
}

// Show alert message
function showAlert(message, type = 'success', duration = 5000) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Find alert placeholder or create one
    let alertPlaceholder = document.getElementById('alertPlaceholder');
    if (!alertPlaceholder) {
        alertPlaceholder = document.createElement('div');
        alertPlaceholder.id = 'alertPlaceholder';
        alertPlaceholder.className = 'position-fixed top-0 start-50 translate-middle-x p-3';
        alertPlaceholder.style.zIndex = '1050';
        document.body.appendChild(alertPlaceholder);
    }

    alertPlaceholder.appendChild(alertContainer);

    // Auto dismiss after duration
    if (duration > 0) {
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertContainer);
            alert.close();
        }, duration);
    }
}

// Check URL for alert messages
function checkForAlertMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const alertMessage = urlParams.get('alert');
    const alertType = urlParams.get('type') || 'success';

    if (alertMessage) {
        showAlert(decodeURIComponent(alertMessage), alertType);

        // Remove alert parameters from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/views/auth/login.html?alert=Please%20login%20to%20continue&type=warning';
        return false;
    }
    return true;
}

// Format number with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get status badge HTML
function getStatusBadge(status) {
    let badgeClass = 'bg-secondary';
    switch(status.toLowerCase()) {
        case 'active':
            badgeClass = 'bg-success';
            break;
        case 'completed':
            badgeClass = 'bg-primary';
            break;
        case 'on hold':
            badgeClass = 'bg-warning';
            break;
        case 'cancelled':
            badgeClass = 'bg-danger';
            break;
        case 'in progress':
            badgeClass = 'bg-info';
            break;
        case 'open':
            badgeClass = 'bg-danger';
            break;
        case 'resolved':
            badgeClass = 'bg-success';
            break;
    }
    return `<span class="badge ${badgeClass}">${status}</span>`;
}

// Get priority badge HTML
function getPriorityBadge(priority) {
    let badgeClass = 'bg-secondary';
    switch(priority.toLowerCase()) {
        case 'high':
            badgeClass = 'bg-danger';
            break;
        case 'medium':
            badgeClass = 'bg-warning';
            break;
        case 'low':
            badgeClass = 'bg-info';
            break;
    }
    return `<span class="badge ${badgeClass}">${priority}</span>`;
}