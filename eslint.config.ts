import { defineConfig } from 'eslint/config';
import { angularEslintConfig } from './eslint/angular/angular-eslint.config';
import { angularInlineTemplateEslintConfig } from './eslint/angular/angular-inline-template-eslint.config';
import { angularTemplateEslintConfig } from './eslint/angular/angular-template-eslint.config';
import { importEslintConfig } from './eslint/import/import-eslint.config';
import { javascriptEslintConfig } from './eslint/javascript/javascript-eslint.config';
import { prettierEslintConfig } from './eslint/prettier/prettier-eslint.config';
import { prettierHtmlEslintConfig } from './eslint/prettier/prettier-html-eslint.config';
import { typescriptEslintConfig } from './eslint/typescript/typescript-eslint.config';

export default defineConfig([
  ...importEslintConfig,
  ...javascriptEslintConfig,
  ...typescriptEslintConfig,
  ...angularEslintConfig,
  ...angularTemplateEslintConfig,
  ...angularInlineTemplateEslintConfig,
  ...prettierEslintConfig,
  ...prettierHtmlEslintConfig,
]);
