const { pathsToModuleNameMapper } = require('ts-jest');
const { jsWithBabel } = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
    '^.+\\.(t|j)sx$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '**/*.(t|j)sx'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  rootDir: './',
  projects: [
    {
      displayName: 'libs',
      rootDir: './libs',
      testMatch: ['<rootDir>/**/*.spec.ts'],
      testEnvironment: 'node',
      ...jsWithBabel,
    },
    {
      displayName: 'api',
      rootDir: './apps/api',
      testMatch: ['<rootDir>/**/*.spec.ts'],
      testEnvironment: 'node',
      moduleNameMapper: pathsToModuleNameMapper(
        require('./apps/api/tsconfig.json').compilerOptions.paths,
        { prefix: '<rootDir>' },
      ),
      ...jsWithBabel,
    },
    {
      displayName: 'web',
      rootDir: './apps/web',
      testMatch: ['<rootDir>/apps/web/**/*.spec.tsx?'],
      ...jsWithBabel,
    },
  ],
};
