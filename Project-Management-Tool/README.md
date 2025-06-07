# Project Management Tool

A comprehensive project management application with team collaboration features.

## Features

- User Registration and Authentication
- Project Management (create, view, update, delete)
- Team Management
- Task and Backlog Management
- User Profiles

## Technologies Used

### Backend
- Java Spring Boot
- Spring Security with JWT Authentication
- MySQL Database
- Maven

### Frontend
- React
- Redux
- Bootstrap
- Axios

## Running the Application

### Quick Start

For Windows users, we've provided batch files for easy startup:

1. To start the backend server:
   - Double-click on `start-backend.bat`
   - The server will start on port 8081

2. To start the frontend development server:
   - Double-click on `start-frontend.bat` 
   - The application will open in your browser (typically at http://localhost:3000)

### Manual Setup

#### Backend

1. Navigate to the backend directory:
   ```
   cd Project-Management-Tool/project_management_tool
   ```

2. Run the Spring Boot application:
   ```
   .\mvnw spring-boot:run -Dserver.port=8081
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd Project-Management-Tool/ppmtool-react-client
   ```

2. Install dependencies (first time only):
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Default Credentials

You can use the following credentials for testing:

- Admin User:
  - Email: admin@test.com
  - Password: password

- Regular User:
  - Email: user@test.com
  - Password: password

## Troubleshooting

- If you encounter a 401 Unauthorized error, make sure both the backend and frontend are running.
- If port 3000 is already in use, the React application will prompt you to use another port. Select 'Y' to continue.
- For database connection issues, verify your MySQL server is running and the credentials in `application.properties` are correct.

## Note for Developers

- The backend API runs on port 8081
- The frontend proxy is configured to redirect API calls to the backend
- JWT tokens expire after 30 minutes of inactivity
