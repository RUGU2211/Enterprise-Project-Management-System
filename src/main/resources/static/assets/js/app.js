// app.js - Main application JavaScript file

// Configuration and Constants
const CONFIG = {
    API_BASE_URL: '/epm/api',
    AUTH_ENDPOINTS: {
        CHECK_AUTH: '/users/me',
        LOGOUT: '/logout'
    },
    ROUTES: {
        LOGIN: '/epm/views/auth/login.html',
        HOME: '/epm/views/dashboard/index.html'
    },
    MESSAGES: {
        SESSION_EXPIRED: 'Session expired. Please login again.',
        GENERIC_ERROR: 'Something went wrong. Please try again.',
        LOGOUT_MESSAGE: 'You have been logged out.'
    }
};

// Enhanced Logging Utility
const Logger = {
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

        switch(level) {
            case 'error':
                console.error(logMessage, data);
                break;
            case 'warn':
                console.warn(logMessage, data);
                break;
            case 'info':
                console.info(logMessage, data);
                break;
            default:
                console.log(logMessage, data);
        }
    }
};

// Component Loading Service
const ComponentLoader = {
    async loadComponent(componentPath, placeholderId) {
        try {
            Logger.log('info', `Loading component: ${componentPath}`, placeholderId);

            const response = await fetch(componentPath);

            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }

            const placeholder = document.getElementById(placeholderId);
            if (!placeholder) {
                throw new Error(`Placeholder not found: ${placeholderId}`);
            }

            placeholder.innerHTML = await response.text();
            Logger.log('info', `Component loaded successfully: ${componentPath}`);
            return true;
        } catch (error) {
            Logger.log('error', `Component load error for ${componentPath}`, error);

            // Display error message in placeholder if it exists
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="alert alert-danger">
                        Failed to load component. Please refresh the page.
                    </div>
                `;
            }

            return false;
        }
    },

    async loadAllComponents() {
        const components = [
            { path: '/epm/components/header.html', id: 'header-placeholder' },
            { path: '/epm/components/sidebar.html', id: 'sidebar-placeholder' },
            { path: '/epm/components/footer.html', id: 'footer-placeholder' }
        ];

        for (const component of components) {
            try {
                await this.loadComponent(component.path, component.id);
            } catch (error) {
                Logger.log('error', `Failed to load component: ${component.path}`, error);
            }
        }

        // Initialize components after loading
        this.initializeComponents();
    },

    initializeComponents() {
        try {
            this.initializeHeader();
            this.initializeSidebar();
        } catch (error) {
            Logger.log('error', 'Error initializing components', error);
        }
    },

    initializeHeader() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                AuthService.logout();
            });
        }

        this.loadUserInfo();
    },

    async loadUserInfo() {
        try {
            const userInfoElement = document.getElementById('userInfo');
            if (!userInfoElement) return;

            // For now, use static user info to avoid API call errors
            userInfoElement.innerHTML = `
                <span class="d-none d-md-inline me-2">Hello, User</span>
                <img src="/epm/assets/img/avatar-placeholder.png" class="avatar-small" alt="User avatar">
            `;
        } catch (error) {
            Logger.log('error', 'Failed to load user info', error);
        }
    },

    initializeSidebar() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.sidebar-menu a');

        menuLinks.forEach(link => {
            if (link && link.getAttribute) {
                const linkHref = link.getAttribute('href');
                if (linkHref && currentPath.includes(linkHref)) {
                    link.classList.add('active');
                }
            }
        });

        // Submenu toggle logic
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(toggle => {
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const parentItem = toggle.closest('.has-submenu');
                    if (parentItem) {
                        parentItem.classList.toggle('open');

                        const submenu = parentItem.querySelector('.submenu');
                        if (submenu) {
                            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                        }
                    }
                });
            }
        });
    }
};

// Authentication Service
const AuthService = {
    async checkAuthentication() {
        try {
            // For demo purposes, just return true to simulate logged in
            return true;
        } catch (error) {
            Logger.log('warn', 'Authentication check failed', error);
            return false;
        }
    },

    async logout() {
        try {
            // Navigate to login page with logout message
            window.location.href = `${CONFIG.ROUTES.LOGIN}?message=${encodeURIComponent(CONFIG.MESSAGES.LOGOUT_MESSAGE)}`;
        } catch (error) {
            Logger.log('error', 'Logout error', error);
            showAlert('Logout failed. Please try again.', 'danger');
        }
    }
};

// Authentication Middleware
const AuthMiddleware = {
    async protect() {
        // Skip auth check for login page
        if (window.location.pathname.includes('/views/auth/')) {
            return true;
        }

        const isAuthenticated = await AuthService.checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
            return false;
        }
        return true;
    }
};

// Document Ready Handler
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Handle URL parameters (messages, errors)
        const params = getUrlParams();
        if (params.message || params.error) {
            showAlert(
                decodeURIComponent(params.message || params.error),
                params.error ? 'danger' : 'info'
            );

            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Load components if not on auth pages
        if (!window.location.pathname.includes('/views/auth/')) {
            await ComponentLoader.loadAllComponents();
        }

        // Check authentication for non-auth pages
        if (!window.location.pathname.includes('/views/auth/')) {
            await AuthMiddleware.protect();
        }
    } catch (error) {
        Logger.log('error', 'Error initializing application', error);
    }
});

// Utility Functions
function showAlert(message, type = 'success') {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
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

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = wrapper.querySelector('.alert');
        if (alert) {
            if (window.bootstrap && window.bootstrap.Alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            } else {
                alert.classList.remove('show');
                setTimeout(() => wrapper.remove(), 150);
            }
        }
    }, 5000);
}

function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function getUrlParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

// API Request helper
async function apiRequest(endpoint, options = {}) {
    try {
        const defaultOptions = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`API Error for ${endpoint}:`, errorData);
            throw new Error(errorData.message || 'API request failed');
        }

        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error(`API request error for ${endpoint}:`, error);
        return null;
    }
}

// Global exports
window.appHelpers = {
    showAlert,
    formatDate,
    getUrlParams,
    apiRequest,
    requireAuth: AuthMiddleware.protect
};

window.ComponentLoader = ComponentLoader;
window.AuthService = AuthService;
window.Logger = Logger;