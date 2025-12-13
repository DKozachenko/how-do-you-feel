/* eslint-disable boundaries/no-unknown-files */
import type { Config } from 'jest';
import { BASE_CONFIG } from './jest.config.base';

const jestConfig: Config = {
  ...BASE_CONFIG,
  displayName: 'How do you feel:Report',
  verbose: false,
  silent: true,
  ci: true,
  collectCoverage: false,
  coverageDirectory: undefined,
  reporters: [['jest-junit', { outputFile: './report/test-results.xml' }]],
};

export default jestConfig;
