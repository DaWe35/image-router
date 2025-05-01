export default {
  transform: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
  testTimeout: 10000
} 