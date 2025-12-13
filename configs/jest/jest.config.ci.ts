/* eslint-disable boundaries/no-unknown-files */
import type { Config } from 'jest';
import { BASE_CONFIG } from './jest.config.base';

const jestConfig: Config = {
  ...BASE_CONFIG,
  displayName: 'How do you feel:CI',
  verbose: true,
  silent: true,
  ci: true,
  collectCoverage: false,
  coverageDirectory: undefined,
  reporters: [
    ['github-actions', { silent: false }],
    'summary',
    ['jest-slow-test-reporter', { numTests: 5, warnOnSlowerThan: 500, color: true }],
  ],
};

export default jestConfig;
