# Knowledge Base Backend

## Overview
The Knowledge Base Backend is a RESTful API built with Node.js and TypeScript. It is designed to manage a dynamic knowledge base system, enabling users to create, update, and manage interconnected topics and resources. The system supports version control, user roles, and permissions to ensure secure and efficient knowledge management.

## Architectural Decisions
This project implements a hybrid architecture combining elements from some architectural patterns:

- **Clean Architecture**: Separation of concerns with distinct layers (domain, application, infrastructure).
- **Domain-Driven Design (DDD)**: Organization around business domains with bounded contexts.
- **Command Query Responsibility Segregation (CQRS)**: Separation of read and write operations to facilitate potential event-driven implementations in the future.

### Database Connection Strategy
Each module has its own database connection pool, this design:

1. **Facilitates Future Microservice Extraction**: Modules can be extracted into separate microservices without significant refactoring.
2. **Supports Database Separation**: Enables individual modules to connect to separate databases if needed for scaling or security purposes.
3. **Encourages Modularity**: Each module can evolve independently, allowing for different database technologies or configurations.

### IMPORTANT NOTE
These architectural decisions were made with EDUCATIONAL PURPOSES in mind, demonstrating various software design principles. For production environments, we might want to consider adjusting the approach based on the specific scaling needs and operational complexity.

## Key Features
- **Dynamic Knowledge Base**: Manage topics and resources with relationships and version control.
- **User Roles and Permissions**: Secure access to resources based on user roles.
- **Swagger Documentation**: Automatically generated API documentation for easy integration.
- **Cloud Integration**: Deployable to Google Cloud Run with Cloud SQL for database management.
- **Clean Architecture**: Organized into domain, application, and infrastructure layers for maintainability.

## Project Structure
The project follows a modular structure based on Clean Architecture principles. Each module is self-contained and includes domain, application, and infrastructure layers.

```
knowledge-base-backend
├── src
│   ├── modules
│   │   ├── topic
│   │   ├── resource
│   │   └── user
│   ├── shared
│   ├── app.ts
│   └── server.ts
├── infra
│   ├── docker
│   └── scripts
├── .github
├── test
├── swagger
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js (version 18 or higher)
- Docker (for PostgreSQL and containerized deployment)
- Google Cloud SDK (for deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/richiebono/dynamic-knowledge-base.git
   cd knowledge-base-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database using Docker:
   ```bash
   cd infra/docker
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   cd infra/scripts
   ./migrate.sh
   ```

### Running the Application if you have a PostgreSQL instance running locally
1. Start the server in development mode:
   ```bash
   npm run start:dev
   ```

2. The API will be available at `http://localhost:3000`.

### Deployment
1. Encode the `.env` file to base64 for secure deployment:
   ```bash
   cd infra/scripts
   ./env-base64.sh
   ```

2. Deploy the application to Google Cloud Run:
   ```bash
   ./cloud_run_deploy.sh
   ```

3. The deployed service URL will be displayed after the deployment is complete.

## API Documentation
API endpoints are documented using Swagger. Access the documentation at:
```
http://localhost:3000/swagger
```

## Testing
The project includes unit and integration tests organized by module in the `test` directory. Below are the available commands for test execution:

### Running Tests

#### All Tests
```bash
npm test
```

#### Unit Tests Only
```bash
npm run test:unit
```

#### Integration Tests Only
```bash
npm run test:integration
```

### Code Coverage

To generate code coverage reports, you can use the following commands:

#### Coverage for All Tests
```bash
npm run test:coverage
```

#### Coverage for Unit Tests
```bash
npm run test:unit:coverage
```

#### Coverage for Integration Tests
```bash
npm run test:integration:coverage
```

The coverage report will be generated in the `coverage` folder and includes:
- General coverage statistics
- Detailed file-by-file view
- HTML report for visual analysis (available at `coverage/lcov-report/index.html`)

### Test Structure

- **Unit Tests**: Located in `test/modules/` and `test/shared/`, following the same structure as the source code and testing components in isolation.
- **Integration Tests**: Located in `test/integration/modules/`, testing the integration between multiple components and the exposed APIs.

The test structure follows best practices with:
- Isolated environment setup for integration tests
- Use of mocks and stubs to isolate external dependencies
- Authentication and permission checks
- Validation of complete business flows

## CI/CD Pipeline
The project includes a GitHub Actions workflow for CI/CD:
- **Unit Tests**: Runs tests with coverage.
- **SonarQube Analysis**: Performs code quality and coverage analysis.
- **Deployment**: Deploys the application to Google Cloud Run.

### Setting Up GitHub Secrets
To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

1. **`ENV`**: Base64-encoded `.env` file.
   - Use the provided script to encode your `.env` file:
     ```bash
     cd infra/scripts
     ./env-base64.sh
     ```
   - This will generate a file named `envs.base64` in the root directory. Copy its content and add it as a secret named `ENV` in your GitHub repository.

2. **`GCP_SERVICE_ACCOUNT_KEY`**: Base64-encoded Google Cloud service account key.
   - Encode your service account key file:
     ```bash
     base64 service-key.json
     ```
   - Copy the output and add it as a secret named `GCP_SERVICE_ACCOUNT_KEY`.

3. **`SONAR_TOKEN`**: Token for SonarQube authentication.
   - Generate a token in your SonarQube account and add it as a secret named `SONAR_TOKEN`.

4. **`SONAR_HOST_URL`**: URL of your SonarQube server.
   - Add the URL (e.g., `https://sonarqube.example.com`) as a secret named `SONAR_HOST_URL`.

5. **`GCP_PROJECT_ID`**: Your Google Cloud project ID.
   - Add your project ID as a secret named `GCP_PROJECT_ID`.

6. **`SERVICE_NAME`**: Name of the Cloud Run service.
   - Add your service name as a secret named `SERVICE_NAME`.

7. **`REGION`**: Region where Cloud Run will be deployed.
   - Add your region (e.g., `us-central1`) as a secret named `REGION`.

### Adding Secrets to GitHub
1. Go to your GitHub repository.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add each secret with its respective name and value.

Once the secrets are configured, the GitHub Actions workflow will use them to authenticate and execute the CI/CD pipeline.

## Environment Variables

Make sure to configure the following environment variables in the `.env` file:

### Database
- `POSTGRES_USER`: Database user.
- `POSTGRES_PASSWORD`: Database password.
- `POSTGRES_HOST`: Database host.
- `POSTGRES_PORT`: Database port.
- `POSTGRES_DATABASE`: Database name.

### Server Configuration
- `PORT`: Port where the server will run.
- `SWAGGER_BASE_URL`: Base URL for accessing Swagger documentation.
- `JWT_SECRET`: Secret key for generating JWT tokens.
- `JWT_EXPIRES_IN`: Expiration time for JWT tokens.

### Google Cloud Platform
- `GCP_PROJECT_ID`: Google Cloud project ID.
- `SERVICE_NAME`: Cloud Run service name.

### Cloud SQL
- `REGION`: Region where Cloud SQL will be created.
- `TIER`: Cloud SQL instance type.
- `DATABASE_VERSION`: Cloud SQL database version.

## GitHub Secrets

Make sure to configure the following secrets in your GitHub repository:

- `ENV`: Base64-encoded `.env` file.
- `GCP_SERVICE_ACCOUNT_KEY`: Base64-encoded Google Cloud service account key.
- `SONAR_TOKEN`: Authentication token for SonarQube.
- `SONAR_HOST_URL`: SonarQube server URL.
- `GCP_PROJECT_ID`: Google Cloud project ID.
- `SERVICE_NAME`: Cloud Run service name.
- `REGION`: Region where Cloud Run will be deployed.

## Running Locally with Docker Compose

You can run the entire application (backend and database) using Docker Compose, without needing to install Node.js or PostgreSQL locally.

### Quick Start

1. Create a `.env` file in the project root with the required environment variables (see the "Environment Variables" section).

2. Build the Docker images:
   ```bash
   docker compose -f infra/docker/docker-compose.yml build
   ```

3. Start the containers:
   ```bash
   docker compose -f infra/docker/docker-compose.yml up -d
   ```
   This will start the backend and PostgreSQL database in containers.

4. (Optional) Run database migrations:
   ```bash
   docker compose -f infra/docker/docker-compose.yml exec app bash -c "cd infra/scripts && ./migrate.sh"
   ```

5. Access the API at:
   ```
   http://localhost:3000
   ```
   And the Swagger documentation at:
   ```
   http://localhost:3000/swagger
   ```

6. To stop and remove the containers:
   ```bash
   docker-compose -f infra/docker/docker-compose.yml down
   ```

> **Tip:** To view backend logs in real time:
> ```bash
> docker-compose -f infra/docker/docker-compose.yml logs -f backend
> ```

### Note on CI/CD Implementation Status

**Important:** Due to time constraints for delivery, the CI/CD pipeline deployment has not been fully tested in a production environment. However, the GitHub Actions workflow structure and infrastructure directory organization demonstrate my preferred approach to CI/CD implementation and infrastructure management. The provided setup can serve as a solid foundation for implementing a complete CI/CD pipeline in a production environment.

## Important Note About User Registration Security

For testing purposes, the admin permission check on the user registration (POST /users) route is initially commented out. This allows you to create the first admin user without requiring authentication. I added a test to check if the user is an admin, so if you don't remove the comment, the test will fail.

**After you have created the initial admin user, you should uncomment the admin permission check in the user registration route (`src/modules/user/infrastructure/routes/userRoutes.ts`) to enforce proper security.**

This ensures that only admin users can register new users in production environments.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.