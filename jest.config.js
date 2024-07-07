module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['js', 'ts', 'json'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };
  