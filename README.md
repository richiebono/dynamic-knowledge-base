# Knowledge Base Backend

## Overview
This project implements a Dynamic Knowledge Base System using Node.js and TypeScript. It features a RESTful API that manages interconnected topics and resources with version control, user roles, and permissions.

## Project Structure
The project follows a Clean Architecture approach, organized into modules for topics, resources, and users, each containing domain, application, and infrastructure layers.

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
├── .github
├── test
├── swagger
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- Docker (for PostgreSQL)
- PostgreSQL (running in Docker)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd knowledge-base-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database using Docker:
   ```
   cd infra/docker
   docker-compose up -d
   ```

4. Run database migrations:
   ```
   cd infra/scripts
   ./migrate.sh
   ```

### Running the Application
1. Start the server:
   ```
   npm run start
   ```

2. The API will be available at `http://localhost:3000`.

## API Documentation
API endpoints are documented using Swagger. Access the documentation at `http://localhost:3000/api-docs`.

## Testing
Unit and integration tests are organized by module in the `test` directory. To run tests, use:
```
npm run test
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.