import 'reflect-metadata'; // Required for inversify
import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { inject, injectable } from 'inversify';
import { DbConnection } from './shared/infrastructure/database/dbConnection';
import { AuthMiddleware } from './shared/infrastructure/middleware/authMiddleware';
import { ErrorHandler } from './shared/infrastructure/middleware/errorHandler';
// import { TopicRoutes } from './modules/topic/infrastructure/routes/topicRoutes';
// import { ResourceRoutes } from './modules/resource/infrastructure/routes/resourceRoutes';
import { UserRoutes } from './modules/user/infrastructure/routes/userRoutes';
import { swaggerSpec } from './shared/infrastructure/config/swaggerConfig';
import { MigrationRunner } from './shared/infrastructure/database/migrationRunner';
import { ENV } from './shared/infrastructure/config/env';

@injectable()
export class App {
    private app: Application;

    constructor(
        @inject(DbConnection) private dbConnection: DbConnection,
        @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
        // @inject(TopicRoutes) private topicRoutes: TopicRoutes,
        // @inject(ResourceRoutes) private resourceRoutes: ResourceRoutes,
        @inject(UserRoutes) private userRoutes: UserRoutes,
        @inject(ErrorHandler) private errorHandler: ErrorHandler,
        @inject(MigrationRunner) private migrationRunner: MigrationRunner
    ) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(this.authMiddleware.validateToken);       
    }

    private initializeRoutes() {
        // this.app.use('/api/topics', this.topicRoutes.getRouter());
        // this.app.use('/api/resources', this.resourceRoutes.getRouter());
        this.app.use('/api/users', this.userRoutes.getRouter());
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeErrorHandling() {
        this.app.use(this.errorHandler.handle);
    }

    public async start(port: number) {
        try {
            // Run migrations
            await this.migrationRunner.up();
            console.log('Migrations applied successfully.');

            // Test database connection
            await this.dbConnection.query('SELECT 1');
        } catch (err) {
            console.error('Database setup failed:', err);
            process.exit(1);
        }

        try {
            this.app.listen(port, () => {
                console.log(`Server is running on ${ENV.SWAGGER_BASE_URL.replace('/api', '')}:${port}`);
            });
        } catch (err) {
            console.error('Server startup failed:', err);
            process.exit(1);
        }
    }
}

