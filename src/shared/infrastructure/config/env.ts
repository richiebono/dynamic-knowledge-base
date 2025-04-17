import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || '3000',
    DATABASE_URL: process.env.DATABASE_URL || '',
    SWAGGER_BASE_URL: process.env.SWAGGER_BASE_URL || 'http://localhost:3000/api',
};
