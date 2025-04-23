import 'reflect-metadata';
import supertest from 'supertest';
import { Application } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Usando o novo alias para o app
import { App } from '@app';
import { container } from '@shared/infrastructure/ioc/container';
import { DbConnection } from '@shared/infrastructure/database/dbConnection';
import { MigrationRunner } from '@shared/infrastructure/database/migrationRunner';
import { ENV } from '@shared/infrastructure/config/env';
import { UserRoleEnum } from '@shared/domain/enum/userRole';

// Helper class for integration testing
export class TestHelper {
  private static instance: TestHelper;
  private app: App;
  private expressApp: Application;
  private dbConnection: DbConnection;
  private pool: Pool;
  
  private constructor() {}
  
  public static getInstance(): TestHelper {
    if (!TestHelper.instance) {
      TestHelper.instance = new TestHelper();
    }
    return TestHelper.instance;
  }
  
  public async initializeApp(): Promise<void> {
    // Initialize IoC container
    this.app = container.resolve(App);
    this.expressApp = this.app.getExpressApp();
    
    // Get database connection
    this.dbConnection = container.get<DbConnection>(DbConnection);
    
    this.pool = new Pool({
      user: ENV.POSTGRES.USER,
      host: ENV.POSTGRES.HOST,
      database: ENV.POSTGRES.DATABASE,
      password: ENV.POSTGRES.PASSWORD,
      port: ENV.POSTGRES.PORT,
    });
    
    // Run migrations
    const migrationRunner = new MigrationRunner(this.pool);
    try {
      await migrationRunner.up();
    } catch (error) {
      console.error('Error setting up test database:', error);
      throw error;
    }
  }
  
  public async cleanupApp(): Promise<void> {
    try {
      // Close database connections
      if (this.pool) {
        await this.pool.end();
      }
      
      // Ensure any other open connections are closed
      if (this.dbConnection) {
        await this.dbConnection.close();
      }
      
      // Small delay to ensure connections are properly closed
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  
  public getExpressApp(): Application {
    return this.expressApp;
  }
  
  public getRequest() {
    return supertest(this.expressApp);
  }
  
  public generateAuthToken(role: UserRoleEnum = UserRoleEnum.Admin): string {
    return jwt.sign(
      { id: 'test-user-id', role },
      ENV.JWT.SECRET as string,
      { expiresIn: ENV.JWT.EXPIRES_IN }
    );
  }
}