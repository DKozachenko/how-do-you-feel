/* eslint-disable boundaries/no-unknown-files */
import { Config } from 'jest';
import { createCjsPreset } from 'jest-preset-angular/presets';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../../tsconfig.json';

export const BASE_CONFIG: Config = {
  ...createCjsPreset(),
  preset: 'jest-preset-angular',
  rootDir: '../../',
  setupFilesAfterEnv: ['<rootDir>/configs/jest/setup-jest.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testMatch: ['**/src/**/*.spec.ts'],
  bail: 1,
  moduleFileExtensions: ['js', 'ts'],
  testTimeout: 3000,
};
