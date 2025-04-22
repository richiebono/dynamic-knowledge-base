import { DbConnection } from "@shared/infrastructure/database/dbConnection";

export class ResourceDbConnection extends DbConnection {
    private constructor() {
        super();
    }

    public static initializeInstance(): void {
        if (!DbConnection.getInstance()) {
            DbConnection.initialize(new ResourceDbConnection());
        }
    }
}
