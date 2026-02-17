module.exports = {
    preset: 'jest-preset-angular',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
};
