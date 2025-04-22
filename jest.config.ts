export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@resource/(.*)$': '<rootDir>/src/modules/resource/$1',
        '^@topic/(.*)$': '<rootDir>/src/modules/topic/$1',
        '^@user/(.*)$': '<rootDir>/src/modules/user/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    rootDir: '.',
};
