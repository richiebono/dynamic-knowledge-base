import { DbConnection } from "@shared/infrastructure/database/dbConnection";

export class ResourceDbConnection extends DbConnection {
    private constructor() {
        super();
    }

    public static initializeInstance(): void {
        if (!DbConnection.isInitialized()) {
            DbConnection.initialize(new ResourceDbConnection());
        }
    }
}
