import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || '3000',
    SWAGGER_BASE_URL: process.env.SWAGGER_BASE_URL || 'http://localhost',
    POSTGRES: {
        USER: process.env.POSTGRES_USER || '',
        HOST: process.env.POSTGRES_HOST || '',
        DATABASE: process.env.POSTGRES_DATABASE || '',
        PASSWORD: process.env.POSTGRES_PASSWORD || '',
        PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    },
};
