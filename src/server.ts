import 'reflect-metadata'; // Required for inversify
import { container } from '@shared/infrastructure/ioc/container';
import { App } from './app';
import { ENV } from '@shared/infrastructure/config/env';

const app = container.resolve(App);

app.start(Number(ENV.PORT)).catch(err => {
    console.error('Application startup failed:', err);
    process.exit(1);
});