// auth.js - Handles all authentication-related functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if we're on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        setupPasswordValidation();
    }

    // Check for redirect parameters
    checkUrlParameters();
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate input
    if (!username || !password) {
        showAlert('Please enter both username and password', 'warning');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll simulate successful login with any credentials

    // Simulate API call delay
    showAlert('Logging in...', 'info');

    setTimeout(() => {
        // Create a mock user object
        const user = {
            id: 1,
            name: username,
            email: `${username}@example.com`,
            role: 'Project Manager'
        };

        // Store user data in localStorage (in a real app, this would be a JWT token or session)
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'sample-token-12345');

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        // Redirect to dashboard
        window.location.href = '/views/dashboard/index.html?alert=Login%20successful&type=success';
    }, 1500);
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsCheck = document.getElementById('termsCheck').checked;

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    if (!validatePassword(password)) {
        showAlert('Password does not meet requirements', 'danger');
        return;
    }

    if (!termsCheck) {
        showAlert('You must agree to the Terms of Service and Privacy Policy', 'warning');
        return;
    }

    // In a real application, this would be an API call
    // For demo purposes, we'll simulate successful registration

    // Simulate API call delay
    showAlert('Creating your account...', 'info');

    setTimeout(() => {
        // Redirect to login page with success message
        window.location.href = 'login.html?alert=Registration%20successful.%20Please%20login%20with%20your%20new%20account&type=success';
    }, 1500);
}

// Set up password validation
function setupPasswordValidation() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }

    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('password').value;
            if (this.value && this.value !== password) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Validate password strength
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
    );
}

// Check URL parameters for message display
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const alertMessage = urlParams.get('alert');
    const alertType = urlParams.get('type') || 'info';

    if (alertMessage) {
        showAlert(decodeURIComponent(alertMessage), alertType);

        // Remove parameters from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Show alert message
function showAlert(message, type) {
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
    alertPlaceholder.append(wrapper);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = bootstrap.Alert.getInstance(wrapper.querySelector('.alert'));
        if (alert) {
            alert.close();
        }
    }, 5000);
}