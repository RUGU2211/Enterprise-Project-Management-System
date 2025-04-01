// users.js - User Management Functionality

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Users page loaded");

    // Load components
    await loadComponents();

    // Check authentication
    await window.appHelpers.requireAuth();

    // Initialize page
    initializeUserManagement();
});

async function loadComponents() {
    try {
        const componentPromises = [
            window.ComponentLoader.loadComponent('/epm/components/header.html', 'header-placeholder'),
            window.ComponentLoader.loadComponent('/epm/components/sidebar.html', 'sidebar-placeholder'),
            window.ComponentLoader.loadComponent('/epm/components/footer.html', 'footer-placeholder')
        ];

        await Promise.all(componentPromises);
        console.log("All components loaded successfully");
    } catch (error) {
        console.error("Error loading components:", error);
    }
}

function initializeUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }

    // Fetch and populate users
    fetchUsers();
}

async function fetchUsers() {
    try {
        const response = await window.appHelpers.apiRequest('/users');

        if (response && response.users) {
            populateUserTable(response.users);
        } else {
            console.warn("No users found or invalid response");
            window.appHelpers.showAlert('No users found', 'warning');
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        window.appHelpers.showAlert('Failed to load users', 'danger');
    }
}

function populateUserTable(users) {
    const tableBody = document.getElementById('usersTableBody');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate table
    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.fullName || 'N/A'}</td>
                <td>${user.roles ? user.roles.map(role => role.name).join(', ') : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Add event listeners for edit and delete buttons
    setupUserActionListeners();
}

function setupUserActionListeners() {
    // Edit user
    document.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            showEditUserModal(userId);
        });
    });

    // Delete user
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.dataset.id;
            confirmDeleteUser(userId);
        });
    });
}

function showAddUserModal() {
    // Placeholder for add user modal logic
    console.log("Show add user modal");
    // You would typically create a modal with a form to add a new user
}

function showEditUserModal(userId) {
    // Placeholder for edit user modal logic
    console.log(`Edit user ${userId}`);
    // You would fetch user details and populate an edit modal
}

function confirmDeleteUser(userId) {
    // Placeholder for delete user confirmation
    console.log(`Confirm delete user ${userId}`);
    // You would show a confirmation dialog and handle user deletion
}