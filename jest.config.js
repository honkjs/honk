const config = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['**/*.{ts}', '!**/node_modules/**', '!**/*.d.ts'],
  collectCoverage: true,
  testEnvironment: 'node',
};

module.exports = config;
