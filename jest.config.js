module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',   
    '!src/**/index.ts', 
    '!src/server.ts',   
    '!src/app.ts',      
    '!src/config/**',   
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};