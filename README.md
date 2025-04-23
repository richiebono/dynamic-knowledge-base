# Knowledge Base Backend

## Overview
The Knowledge Base Backend is a RESTful API built with Node.js and TypeScript. It is designed to manage a dynamic knowledge base system, enabling users to create, update, and manage interconnected topics and resources. The system supports version control, user roles, and permissions to ensure secure and efficient knowledge management.

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
   git clone <repository-url>
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

### Running the Application
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
Unit and integration tests are organized by module in the `test` directory. To run tests, use:
```bash
npm run test
```

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
   docker compose -f infra/docker/docker-compose.yml exec backend bash -c "cd infra/scripts && ./migrate.sh"
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

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.