// auth.js - Authentication JS file

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

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const error = urlParams.get('error');
    const type = urlParams.get('type') || 'info';

    if (message) {
        showAlert(decodeURIComponent(message), type);
    }

    if (error) {
        showAlert(decodeURIComponent(error), 'danger');
    }

    // Remove parameters from URL
    if (message || error) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate input
    if (!username || !password) {
        showAlert('Please enter both username and password', 'warning');
        return;
    }

    showAlert('Logging in...', 'info');

    try {
        const response = await fetch('/epm/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                rememberMe
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Login failed');
        }

        const data = await response.json();

        // Store the token
        localStorage.setItem('auth_token', data.token);

        // Redirect to dashboard
        window.location.href = '/epm/views/dashboard/index.html?message=Login successful';
    } catch (error) {
        showAlert(error.message || 'Login failed. Please check your credentials.', 'danger');
    }
}

// Handle register form submission
async function handleRegister(e) {
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

    showAlert('Creating your account...', 'info');

    try {
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

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Registration failed');
        }

        // Redirect to login page with success message
        window.location.href = 'login.html?message=Registration successful. Please login with your new account&type=success';
    } catch (error) {
        showAlert(error.message || 'Registration failed. Please try again.', 'danger');
    }
}

// Set up password validation
function setupPasswordValidation() {
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

// Show alert message
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
        if (wrapper.querySelector('.alert')) {
            const alert = new bootstrap.Alert(wrapper.querySelector('.alert'));
            alert.close();
        }
    }, 5000);
}