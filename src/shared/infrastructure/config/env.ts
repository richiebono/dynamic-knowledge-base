import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

type JwtExpiresIn = '1h' | '2h' | '12h' | '24h' | '7d' | '30d';

interface EnvConfig {
    PORT: string;
    SWAGGER_BASE_URL: string;
    POSTGRES: {
        USER: string;
        HOST: string;
        DATABASE: string;
        PASSWORD: string;
        PORT: number;
    };
    JWT: {
        SECRET: string;
        EXPIRES_IN: JwtExpiresIn;
    };
}

export const ENV: EnvConfig = {
    PORT: process.env.PORT || '3000',
    SWAGGER_BASE_URL: process.env.SWAGGER_BASE_URL || 'http://localhost',
    POSTGRES: {
        USER: process.env.POSTGRES_USER || '',
        HOST: process.env.POSTGRES_HOST || '',
        DATABASE: process.env.POSTGRES_DATABASE || '',
        PASSWORD: process.env.POSTGRES_PASSWORD || '',
        PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || '',
        EXPIRES_IN: (process.env.JWT_EXPIRES_IN as JwtExpiresIn) || '1h',
    }
};


