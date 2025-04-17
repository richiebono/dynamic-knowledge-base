"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Required for inversify
const container_1 = require("./shared/infrastructure/ioc/container");
const app_1 = require("./app");
const env_1 = require("./shared/infrastructure/config/env");
const app = container_1.container.resolve(app_1.App);
app.start(Number(env_1.ENV.PORT)).catch(err => {
    console.error('Application startup failed:', err);
    process.exit(1);
});
