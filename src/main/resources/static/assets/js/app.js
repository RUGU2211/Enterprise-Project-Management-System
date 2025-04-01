// // app.js - Main application JavaScript file
//
// // Configuration and Constants
// const CONFIG = {
//     API_BASE_URL: '/epm/api',
//     AUTH_ENDPOINTS: {
//         CHECK_AUTH: '/users/me',
//         LOGOUT: '/logout'
//     },
//     ROUTES: {
//         LOGIN: '/epm/views/auth/login.html',
//         HOME: '/epm/views/dashboard/index.html'
//     },
//     MESSAGES: {
//         SESSION_EXPIRED: 'Session expired. Please login again.',
//         GENERIC_ERROR: 'Something went wrong. Please try again.',
//         LOGOUT_MESSAGE: 'You have been logged out.'
//     }
// };
//
// // Enhanced Fetch Wrapper for API Requests
// const createFetchClient = () => {
//     const defaultHeaders = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     };
//
//     const handleResponse = async (response) => {
//         console.log("response.status"+response.status);
//         if (response.status === 401) {
//             console.warn('Unauthorized access detected');
//             window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
//             return null;
//         }
//
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || CONFIG.MESSAGES.GENERIC_ERROR);
//         }
//
//         return response.status === 204 ? null : await response.json();
//     };
//
//     return {
//         get: async (endpoint, options = {}) => {
//             try {
//                 const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
//                     method: 'GET',
//                     credentials: 'include',
//                     headers: { ...defaultHeaders, ...options.headers },
//                     ...options
//                 });
//                 return await handleResponse(response);
//             } catch (error) {
//                 console.error(`GET request error to ${endpoint}:`, error);
//                 throw error;
//             }
//         },
//
//         post: async (endpoint, body, options = {}) => {
//             try {
//                 const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: { ...defaultHeaders, ...options.headers },
//                     body: JSON.stringify(body),
//                     ...options
//                 });
//                 return await handleResponse(response);
//             } catch (error) {
//                 console.error(`POST request error to ${endpoint}:`, error);
//                 throw error;
//             }
//         }
//     };
// };
//
// // Authentication Service
// const AuthService = {
//     client: createFetchClient(),
//
//     async checkAuthentication() {
//         try {
//             const userInfo = await this.client.get(CONFIG.AUTH_ENDPOINTS.CHECK_AUTH);
//             return userInfo !== null;
//         } catch (error) {
//             console.warn('Authentication check failed:', error);
//             return false;
//         }
//     },
//
//     async logout() {
//         try {
//             await fetch(CONFIG.AUTH_ENDPOINTS.LOGOUT, {
//                 method: 'POST',
//                 credentials: 'include'
//             });
//             window.location.href = `${CONFIG.ROUTES.LOGIN}?message=${encodeURIComponent(CONFIG.MESSAGES.LOGOUT_MESSAGE)}`;
//         } catch (error) {
//             console.error('Logout failed:', error);
//             showAlert('Logout failed. Please try again.', 'danger');
//         }
//     }
// };
//
// // Utility Functions
// const Utils = {
//     showAlert(message, type = 'success', options = {}) {
//         const {
//             container = 'alertPlaceholder',
//             timeout = 5000
//         } = options;
//
//         const alertPlaceholder = document.getElementById(container);
//         if (!alertPlaceholder) return;
//
//         alertPlaceholder.innerHTML = `
//             <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//                 ${message}
//                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//             </div>
//         `;
//
//         if (timeout > 0) {
//             setTimeout(() => {
//                 const alert = alertPlaceholder.querySelector('.alert');
//                 alert && new bootstrap.Alert(alert).close();
//             }, timeout);
//         }
//     },
//
//     formatDate(dateString, options = {}) {
//         if (!dateString) return '';
//         const defaultOptions = {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         };
//         return new Date(dateString).toLocaleDateString(undefined, { ...defaultOptions, ...options });
//     },
//
//     getUrlParams() {
//         return Object.fromEntries(new URLSearchParams(window.location.search));
//     }
// };
//
// // Component Loading Service
// const ComponentLoader = {
//     async loadComponent(componentPath, placeholderId) {
//         try {
//             const response = await fetch(componentPath);
//             if (!response.ok) throw new Error(`Failed to load component: ${componentPath}`);
//
//             const placeholder = document.getElementById(placeholderId);
//             if (placeholder) {
//                 placeholder.innerHTML = await response.text();
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             console.error(`Component load error for ${componentPath}:`, error);
//             return false;
//         }
//     },
//
//     async loadAllComponents() {
//         const components = [
//             { path: '/epm/components/header.html', id: 'header-placeholder' },
//             { path: '/epm/components/sidebar.html', id: 'sidebar-placeholder' },
//             { path: '/epm/components/footer.html', id: 'footer-placeholder' }
//         ];
//
//         for (const component of components) {
//             await this.loadComponent(component.path, component.id);
//         }
//
//         // Initialize components after loading
//         this.initializeComponents();
//     },
//
//     initializeComponents() {
//         this.initializeHeader();
//         this.initializeSidebar();
//     },
//
//     initializeHeader() {
//         const logoutBtn = document.getElementById('logoutBtn');
//         if (logoutBtn) {
//             logoutBtn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 AuthService.logout();
//             });
//         }
//
//         this.loadUserInfo();
//     },
//
//     async loadUserInfo() {
//         try {
//             const userInfoElement = document.getElementById('userInfo');
//             if (!userInfoElement) return;
//
//             const userInfo = await AuthService.client.get(CONFIG.AUTH_ENDPOINTS.CHECK_AUTH);
//             if (userInfo) {
//                 userInfoElement.innerHTML = `
//                     <span class="d-none d-md-inline me-2">Hello, ${userInfo.fullName || userInfo.username}</span>
//                     <img src="${userInfo.avatarUrl || '/epm/assets/img/avatar-placeholder.png'}"
//                          class="avatar-small" alt="User avatar">
//                 `;
//             }
//         } catch (error) {
//             console.error('Failed to load user info:', error);
//         }
//     },
//
//     initializeSidebar() {
//         const currentPath = window.location.pathname;
//         const menuLinks = document.querySelectorAll('.sidebar-menu a');
//
//         menuLinks.forEach(link => {
//             const linkHref = link.getAttribute('href');
//             if (currentPath.includes(linkHref)) {
//                 link.classList.add('active');
//
//                 const parentMenu = link.closest('.has-submenu');
//                 if (parentMenu) {
//                     parentMenu.classList.add('open');
//                     const submenu = parentMenu.querySelector('.submenu');
//                     if (submenu) submenu.style.display = 'block';
//                 }
//             }
//         });
//
//         // Submenu toggle logic
//         const submenuToggles = document.querySelectorAll('.submenu-toggle');
//         submenuToggles.forEach(toggle => {
//             toggle.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const parentItem = toggle.closest('.has-submenu');
//                 parentItem.classList.toggle('open');
//
//                 const submenu = parentItem.querySelector('.submenu');
//                 if (submenu) {
//                     submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
//                 }
//             });
//         });
//     }
// };
//
// // Authentication Middleware
// const AuthMiddleware = {
//     async protect() {
//         // Skip auth check for login page
//         if (window.location.pathname.includes('/views/auth/')) return;
//
//         const isAuthenticated = await AuthService.checkAuthentication();
//         if (!isAuthenticated) {
//             window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
//         }
//     }
// };
//
// // Document Ready Handler
// document.addEventListener('DOMContentLoaded', async () => {
//     // Handle URL parameters (messages, errors)
//     const params = Utils.getUrlParams();
//     if (params.message || params.error) {
//         Utils.showAlert(
//             decodeURIComponent(params.message || params.error),
//             params.error ? 'danger' : 'info'
//         );
//
//         // Clean URL
//         window.history.replaceState({}, document.title, window.location.pathname);
//     }
//
//     // Load components and check authentication
//     await ComponentLoader.loadAllComponents();
//     await AuthMiddleware.protect();
// });
//
// // Compatibility Layer for Existing Scripts
// window.appHelpers = {
//     // API Request Method (Maintain compatibility with previous implementation)
//     apiRequest: async (endpoint, options = {}) => {
//         try {
//             const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
//                 method: options.method || 'GET',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                     ...options.headers
//                 },
//                 body: options.body ? JSON.stringify(options.body) : undefined
//             });
//
//             if (response.status === 401) {
//                 window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
//                 return null;
//             }
//
//             if (!response.ok) {
//                 throw new Error('API request failed');
//             }
//
//             return response.status === 204 ? null : await response.json();
//         } catch (error) {
//             console.error(`API request error to ${endpoint}:`, error);
//             return null;
//         }
//     },
//
//     // Compatibility methods for existing scripts
//     showAlert: Utils.showAlert,
//     formatDate: Utils.formatDate,
//     getUrlParams: Utils.getUrlParams,
//
//     // Authentication compatibility methods
//     requireAuth: async () => {
//         try {
//             await AuthMiddleware.protect();
//             return true;
//         } catch (error) {
//             console.error('Authentication check failed:', error);
//             return false;
//         }
//     },
//     isAuthenticated: () => AuthService.checkAuthentication()
// };
//
// // Global exports
// window.AuthService = AuthService;
// window.Utils = Utils;
// window.ComponentLoader = ComponentLoader;



//for testing

// Enhanced Authentication and Error Handling

const CONFIG = {
    API_BASE_URL: '/epm/api',
    AUTH_ENDPOINTS: {
        CHECK_AUTH: '/users/me',
        LOGIN: '/login',
        LOGOUT: '/logout'
    },
    ROUTES: {
        LOGIN: '/epm/views/auth/login.html',
        DASHBOARD: '/epm/views/dashboard/index.html'
    },
    MESSAGES: {
        SESSION_EXPIRED: 'Session expired. Please login again.',
        AUTHENTICATION_FAILED: 'Authentication failed. Please try again.',
        LOGOUT_SUCCESS: 'You have been logged out successfully.',
        COMPONENT_LOAD_ERROR: 'Failed to load component. Please refresh the page.'
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

// Enhanced Fetch Client with Comprehensive Error Handling
const createFetchClient = () => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const handleResponse = async (response, endpoint) => {
        try {
            if (response.status === 401) {
                Logger.log('warn', `Unauthorized access to ${endpoint}`);
                window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(CONFIG.MESSAGES.SESSION_EXPIRED)}`;
                return null;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `Request failed with status ${response.status}`;

                Logger.log('error', `API Error for ${endpoint}`, {
                    status: response.status,
                    message: errorMessage
                });

                throw new Error(errorMessage);
            }

            return response.status === 204 ? null : await response.json();
        } catch (error) {
            Logger.log('error', `Response handling error for ${endpoint}`, error);
            throw error;
        }
    };

    return {
        get: async (endpoint, options = {}) => {
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { ...defaultHeaders, ...options.headers },
                    ...options
                });
                return await handleResponse(response, endpoint);
            } catch (error) {
                Logger.log('error', `GET request error to ${endpoint}`, error);
                throw error;
            }
        }
    };
};

// Enhanced Component Loader with Error Handling
const ComponentLoader = {
    async loadComponent(componentPath, placeholderId) {
        try {
            Logger.log('info', `Loading component: ${componentPath}`);

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

            // Display error message in placeholder
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="alert alert-danger">
                        ${CONFIG.MESSAGES.COMPONENT_LOAD_ERROR}
                        <br>Details: ${error.message}
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

        const loadPromises = components.map(component =>
            this.loadComponent(component.path, component.id)
        );

        try {
            const results = await Promise.allSettled(loadPromises);

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    Logger.log('error', `Failed to load component: ${components[index].path}`, result.reason);
                }
            });

            // Initialize components after loading
            this.initializeComponents();
        } catch (error) {
            Logger.log('error', 'Error loading components', error);
        }
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

            const userInfo = await AuthService.client.get(CONFIG.AUTH_ENDPOINTS.CHECK_AUTH);

            if (userInfo) {
                userInfoElement.innerHTML = `
                    <span class="d-none d-md-inline me-2">Hello, ${userInfo.fullName || userInfo.username}</span>
                    <img src="${userInfo.avatarUrl || '/epm/assets/img/avatar-placeholder.png'}" 
                         class="avatar-small" alt="User avatar">
                `;
            }
        } catch (error) {
            Logger.log('error', 'Failed to load user info', error);
            // Fallback to generic user display
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.innerHTML = '<span class="d-none d-md-inline me-2">Hello, User</span>';
            }
        }
    },

    initializeSidebar() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.sidebar-menu a');

        menuLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPath.includes(linkHref)) {
                link.classList.add('active');

                const parentMenu = link.closest('.has-submenu');
                if (parentMenu) {
                    parentMenu.classList.add('open');
                    const submenu = parentMenu.querySelector('.submenu');
                    if (submenu) submenu.style.display = 'block';
                }
            }
        });

        // Submenu toggle logic
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
    }
};

// Authentication Service
const AuthService = {
    client: createFetchClient(),

    async login(username, password) {
        try {
            const response = await fetch(CONFIG.AUTH_ENDPOINTS.LOGIN, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || CONFIG.MESSAGES.AUTHENTICATION_FAILED);
            }

            // Redirect to dashboard or handle successful login
            window.location.href = CONFIG.ROUTES.DASHBOARD;
        } catch (error) {
            Logger.log('error', 'Login error', error);
            this.handleAuthError(error);
        }
    },

    async logout() {
        try {
            const response = await fetch(CONFIG.AUTH_ENDPOINTS.LOGOUT, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = `${CONFIG.ROUTES.LOGIN}?message=${encodeURIComponent(CONFIG.MESSAGES.LOGOUT_SUCCESS)}`;
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            Logger.log('error', 'Logout error', error);
            this.handleAuthError(error);
        }
    },

    async checkAuthentication() {
        try {
            const userInfo = await this.client.get(CONFIG.AUTH_ENDPOINTS.CHECK_AUTH);
            return userInfo !== null;
        } catch (error) {
            Logger.log('warn', 'Authentication check failed', error);
            return false;
        }
    },

    handleAuthError(error) {
        const errorMessage = error.message || CONFIG.MESSAGES.AUTHENTICATION_FAILED;
        window.appHelpers.showAlert(errorMessage, 'danger');
        this.redirectToLogin();
    },

    redirectToLogin(errorMessage = CONFIG.MESSAGES.SESSION_EXPIRED) {
        window.location.href = `${CONFIG.ROUTES.LOGIN}?error=${encodeURIComponent(errorMessage)}`;
    }
};

// Authentication Middleware
const AuthMiddleware = {
    async protect() {
        // Skip auth check for login page
        if (window.location.pathname.includes('/views/auth/')) return true;

        const isAuthenticated = await AuthService.checkAuthentication();
        if (!isAuthenticated) {
            AuthService.redirectToLogin();
            return false;
        }
        return true;
    }
};

// Document Ready Handler
document.addEventListener('DOMContentLoaded', async () => {
    // Handle URL parameters (messages, errors)
    const params = window.appHelpers.getUrlParams();
    if (params.message || params.error) {
        window.appHelpers.showAlert(
            decodeURIComponent(params.message || params.error),
            params.error ? 'danger' : 'info'
        );

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load components and check authentication
    await ComponentLoader.loadAllComponents();
    await AuthMiddleware.protect();
});

// Compatibility Layer
window.appHelpers = {
    // Existing helpers
    showAlert: (message, type, options) => {
        const alertContainer = document.getElementById('alertPlaceholder') || document.body;
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type || 'info'} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        alertContainer.appendChild(alertDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    },

    // Authentication compatibility methods
    requireAuth: async () => {
        try {
            await AuthMiddleware.protect();
            return true;
        } catch (error) {
            Logger.log('error', 'Authentication check failed', error);
            return false;
        }
    },

    isAuthenticated: () => AuthService.checkAuthentication(),

    // API Request method
    apiRequest: async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: options.method || 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : undefined
            });

            if (response.status === 401) {
                AuthService.redirectToLogin();
                return null;
            }

            if (!response.ok) {
                throw new Error('API request failed');
            }

            return response.status === 204 ? null : await response.json();
        } catch (error) {
            Logger.log('error', `API request error to ${endpoint}`, error);
            return null;
        }
    },

    // Other utility methods
    formatDate: (dateString, options = {}) => {
        if (!dateString) return '';
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, { ...defaultOptions, ...options });
    },

    getUrlParams: () => {
        return Object.fromEntries(new URLSearchParams(window.location.search));
    }
};

// Global service exports
window.AuthService = AuthService;
window.Logger = Logger;