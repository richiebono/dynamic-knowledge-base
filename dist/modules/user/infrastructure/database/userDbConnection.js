"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDbConnection = void 0;
const dbConnection_1 = require("shared/infrastructure/database/dbConnection");
class UserDbConnection extends dbConnection_1.DbConnection {
    constructor() {
        super();
    }
    static initializeInstance() {
        if (!dbConnection_1.DbConnection.getInstance()) {
            dbConnection_1.DbConnection.initialize(new UserDbConnection());
        }
    }
}
exports.UserDbConnection = UserDbConnection;
