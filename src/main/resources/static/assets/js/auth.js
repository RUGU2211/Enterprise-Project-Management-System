// auth.js - Authentication JS file

document.addEventListener('DOMContentLoaded', function() {
    console.log("Auth.js loaded and initializing");

    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found, adding submit handler");
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if we're on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Register form found, adding submit handler");
        registerForm.addEventListener('submit', handleRegister);
        setupPasswordValidation();
    }

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    const type = urlParams.get('type') || 'info';

    if (message) {
        console.log("URL message parameter found:", message);
        displayAlert(decodeURIComponent(message), type);
    }

    if (error) {
        console.log("URL error parameter found:", error);
        displayAlert(decodeURIComponent(error), 'danger');
    }

    // Remove parameters from URL
    if (message || error) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});

// Handle login form submission - updated for session-based auth
async function handleLogin(e) {
    e.preventDefault();
    console.log("Login form submitted");

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    // Validate input
    if (!username || !password) {
        displayAlert('Please enter both username and password', 'warning');
        return;
    }

    displayAlert('Logging in...', 'info');

    try {
        // Use the standard form login endpoint for Spring Security
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('remember-me', rememberMe);

        console.log("Sending login request to Spring Security endpoint");
        const response = await fetch('/epm/login', {
            method: 'POST',
            body: formData,
            credentials: 'include', // Important for session cookies
            redirect: 'manual' // Handle redirects manually
        });

        console.log("Login response status:", response.status);

        // For form-based authentication, a 302 redirect is actually success
        if (response.status === 302 || response.ok) {
            console.log("Login successful, redirecting to dashboard");
            // Clear any previous token
            localStorage.removeItem('auth_token');

            // Redirect to dashboard
            window.location.href = '/epm/views/dashboard/index.html?message=Login successful';
            return;
        }

        // Handle login error
        displayAlert('Login failed. Please check your credentials.', 'danger');
    } catch (error) {
        console.error("Login error:", error);
        displayAlert(error.message || 'Login failed. Please check your credentials.', 'danger');
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    console.log("Register form submitted");

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsCheck = document.getElementById('termsCheck').checked;

    // Validate input
    if (!firstName || !lastName || !email || !username || !password) {
        displayAlert('Please fill in all required fields', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        displayAlert('Passwords do not match', 'danger');
        return;
    }

    if (!validatePassword(password)) {
        displayAlert('Password does not meet requirements', 'danger');
        return;
    }

    if (!termsCheck) {
        displayAlert('You must agree to the Terms of Service and Privacy Policy', 'warning');
        return;
    }

    displayAlert('Creating your account...', 'info');

    try {
        console.log("Sending registration request");
        const response = await fetch('/epm/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                email,
                fullName: `${firstName} ${lastName}`
            })
        });

        console.log("Registration response status:", response.status);

        if (!response.ok) {
            let errorMsg = 'Registration failed';
            try {
                const data = await response.json();
                errorMsg = data.message || errorMsg;
            } catch (e) {
                console.error("Could not parse error response:", e);
            }
            throw new Error(errorMsg);
        }

        // Redirect to login page with success message
        console.log("Registration successful, redirecting to login page");
        window.location.href = 'login.html?message=Registration successful. Please login with your new account&type=success';
    } catch (error) {
        console.error("Registration error:", error);
        displayAlert(error.message || 'Registration failed. Please try again.', 'danger');
    }
}

// Set up password validation
function setupPasswordValidation() {
    console.log("Setting up password validation");

    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
            updatePasswordStrength(this.value);
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
    console.log("Validating password strength");

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

// Update password strength indicator
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    if (!strengthIndicator) return;

    // Calculate strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    // Update indicator
    let strengthClass = '';
    let strengthText = '';

    switch(strength) {
        case 0:
        case 1:
            strengthClass = 'bg-danger';
            strengthText = 'Weak';
            break;
        case 2:
        case 3:
            strengthClass = 'bg-warning';
            strengthText = 'Moderate';
            break;
        case 4:
            strengthClass = 'bg-info';
            strengthText = 'Good';
            break;
        case 5:
            strengthClass = 'bg-success';
            strengthText = 'Strong';
            break;
    }

    strengthIndicator.innerHTML = `
        <div class="progress mb-2">
            <div class="progress-bar ${strengthClass}" role="progressbar" 
                style="width: ${strength * 20}%" 
                aria-valuenow="${strength * 20}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <small class="text-muted">${strengthText}</small>
    `;
}

// Renamed from showAlert to displayAlert to avoid conflicts
function displayAlert(message, type = 'success') {
    console.log(`Showing alert: ${message} (${type})`);

    // First try to use the global showAlert if it exists (from app.js)
    if (window.appHelpers && typeof window.appHelpers.showAlert === 'function') {
        window.appHelpers.showAlert(message, type);
        return;
    }

    // Fallback to our own implementation if global function not available
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    if (!alertPlaceholder) {
        console.warn("Alert placeholder not found");
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

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (wrapper.querySelector('.alert')) {
            try {
                const alert = new bootstrap.Alert(wrapper.querySelector('.alert'));
                alert.close();
            } catch (error) {
                console.error("Error closing alert:", error);
                // Fallback if bootstrap Alert isn't available
                wrapper.querySelector('.alert')?.remove();
            }
        }
    }, 5000);
}