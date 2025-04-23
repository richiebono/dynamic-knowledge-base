// Import path setup before anything else
import './paths';
import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { inject, injectable } from 'inversify';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { AuthMiddleware } from '@shared/infrastructure/middleware/authMiddleware';
import { ErrorHandler } from '@shared/infrastructure/middleware/errorHandler';
import { TopicRoutes } from '@topic/infrastructure/routes/topicRoutes';
import { ResourceRoutes } from '@resource/infrastructure/routes/resourceRoutes';
import { UserRoutes } from '@user/infrastructure/routes/userRoutes';
import { setupSwagger } from '@shared/infrastructure/config/swaggerConfig';

@injectable()
export class App {
    private app: Application;

    constructor(
        @inject(DbConnection) private dbConnection: DbConnection,
        @inject(AuthMiddleware) private authMiddleware: AuthMiddleware,
        @inject(TopicRoutes) private topicRoutes: TopicRoutes,
        @inject(ResourceRoutes) private resourceRoutes: ResourceRoutes,
        @inject(UserRoutes) private userRoutes: UserRoutes,
        @inject(ErrorHandler) private errorHandler: ErrorHandler,
    ) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        // Configure CORS to allow requests from all origins
        this.app.use(cors({
            origin: true, // Allow all origins with credentials
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
        
        this.app.use(express.json());
        setupSwagger(this.app);
        this.app.use(this.authMiddleware.validateToken);          
    }

    private initializeRoutes() {
        // Add an OPTIONS route handler for preflight requests
        this.app.options('*', cors());
        
        // Add health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
        
        // Add base route to redirect to swagger
        this.app.get('/', (req, res) => {
            res.redirect('/swagger');
        });
        
        this.app.use('/api/topics', this.topicRoutes.getRouter());
        this.app.use('/api/resources', this.resourceRoutes.getRouter());
        this.app.use('/api/users', this.userRoutes.getRouter());
    }

    private initializeErrorHandling() {
        this.app.use(this.errorHandler.handle);
    }

    public async start(port: number) {
        try {           
            await this.dbConnection.query('SELECT 1');
        } catch (err) {
            console.error('Database setup failed:', err);
            process.exit(1);
        }

        try {
            this.app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}/swagger`);
            });
        } catch (err) {
            console.error('Server startup failed:', err);
            process.exit(1);
        }
    }
}

