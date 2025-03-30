// app.js - Main application JavaScript file

// Base API URL - change this to match your Spring Boot app's URL
const API_BASE_URL = '/epm/api';

// Authentication token handling
const getAuthToken = () => localStorage.getItem('auth_token');
const setAuthToken = (token) => localStorage.setItem('auth_token', token);
const removeAuthToken = () => localStorage.removeItem('auth_token');

// Check if user is logged in
const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
};

// Redirect to login if not authenticated
const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.href = '/epm/views/auth/login.html';
        return false;
    }
    return true;
};

// API request helper with authentication
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            removeAuthToken();
            window.location.href = '/epm/views/auth/login.html?error=Session expired. Please login again.';
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        showAlert(error.message || 'Something went wrong. Please try again.', 'danger');
        return null;
    }
};

// Show alert message
const showAlert = (message, type = 'success', container = 'alertPlaceholder', timeout = 5000) => {
    const alertPlaceholder = document.getElementById(container);
    if (!alertPlaceholder) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertPlaceholder.innerHTML = '';
    alertPlaceholder.appendChild(wrapper);

    if (timeout > 0) {
        setTimeout(() => {
            if (wrapper.querySelector('.alert')) {
                const alert = new bootstrap.Alert(wrapper.querySelector('.alert'));
                alert.close();
            }
        }, timeout);
    }
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get URL parameters
const getUrlParams = () => {
    const params = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
        params[key] = value;
    });
    return params;
};

// Load components (header, footer, sidebar)
const loadComponents = () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        fetch('/epm/components/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // Initialize header elements after loading
                initializeHeader();
            });
    }

    if (sidebarPlaceholder) {
        fetch('/epm/components/sidebar.html')
            .then(response => response.text())
            .then(data => {
                sidebarPlaceholder.innerHTML = data;
                // Initialize sidebar elements after loading
                initializeSidebar();
            });
    }

    if (footerPlaceholder) {
        fetch('/epm/components/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }
};

// Initialize header elements
const initializeHeader = () => {
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement && isAuthenticated()) {
        // Get user info from API
        apiRequest('/users/me')
            .then(user => {
                if (user) {
                    userInfoElement.innerHTML = `
                        <span class="d-none d-md-inline me-2">Hello, ${user.fullName || user.username}</span>
                        <img src="${user.avatarUrl || '/epm/assets/img/avatar-placeholder.png'}" class="avatar-small" alt="User avatar">
                    `;
                }
            });
    }

    // Logout button event
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            apiRequest('/auth/logout', { method: 'POST' })
                .finally(() => {
                    removeAuthToken();
                    window.location.href = '/epm/views/auth/login.html?message=You have been logged out.';
                });
        });
    }
};

// Initialize sidebar elements
const initializeSidebar = () => {
    // Set active menu item based on current page
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.sidebar-menu a');

    menuLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
            // If in submenu, expand the parent menu
            const parentMenu = link.closest('.has-submenu');
            if (parentMenu) {
                parentMenu.classList.add('open');
                const submenu = parentMenu.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = 'block';
                }
            }
        }
    });

    // Submenu toggle
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentItem = toggle.closest('.has-submenu');
            parentItem.classList.toggle('open');
            const submenu = parentItem.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
};

// Document ready function
document.addEventListener('DOMContentLoaded', () => {
    // Check for URL parameters
    const params = getUrlParams();
    if (params.message) {
        showAlert(decodeURIComponent(params.message), params.type || 'info');

        // Remove parameters from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    // Load components
    loadComponents();

    // Check authentication for pages that require login
    if (!window.location.pathname.includes('/views/auth/')) {
        requireAuth();
    }
});

// Export functions for use in other scripts
window.appHelpers = {
    apiRequest,
    showAlert,
    formatDate,
    getUrlParams,
    isAuthenticated,
    requireAuth
};