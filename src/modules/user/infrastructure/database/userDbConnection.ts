import { DbConnection } from '@shared/infrastructure/database/dbConnection';

export class UserDbConnection extends DbConnection {
    public constructor() {
        super();
    }

    public static initializeInstance(): void {
        if (!DbConnection.isInitialized()) {
            DbConnection.initialize(new UserDbConnection());
        }
    }
}
