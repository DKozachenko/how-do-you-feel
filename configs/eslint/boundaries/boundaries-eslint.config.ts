import { Linter } from 'eslint';
import { Config } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';

export const boundariesEslintConfig: (Linter.Config & { extends: Config[] })[] = [
  {
    name: 'boundaries-eslint/settings',
    files: ['**/*.ts'],
    ignores: [''],
    plugins: { boundaries },
    extends: [boundaries.configs.strict],
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'main',
              allow: ['app'],
            },
            {
              from: 'core',
              allow: ['env', 'core'],
            },
            {
              from: 'ui',
              allow: ['env', 'ui'],
            },
            {
              from: 'layout',
              allow: ['env', 'core', 'ui', 'pattern', 'layout', 'feature-routes'],
            },
            {
              from: 'app',
              allow: ['env', 'app', 'core', 'layout', 'feature-routes'],
            },
            {
              from: ['pattern'],
              allow: ['env', 'core', 'ui', 'pattern'],
            },
            {
              from: ['feature'],
              allow: ['env', 'core', 'ui', 'pattern', ['feature', { feature: '${from.feature}' }]],
            },
            {
              from: ['feature-routes'],
              allow: [
                'env',
                'core',
                'pattern',
                ['feature', { feature: '${from.feature}' }],
                ['feature-routes', { feature: '!${from.feature}' }],
              ],
            },
            {
              from: ['test-files'],
              allow: ['env', 'core', 'layout', 'ui', 'pattern', 'feature', 'feature-routes', 'page-object-files'],
            },
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'boundaries/ignore': [
        '**/*-eslint.config.ts',
        'common-prettier-rules.ts',
        'eslint.config.ts',
        'capacitor.config.ts',
      ],
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      'boundaries/elements': [
        {
          type: 'env',
          pattern: 'environments',
        },
        {
          type: 'main',
          mode: 'file',
          pattern: 'main.ts',
        },
        {
          type: 'app',
          mode: 'file',
          pattern: 'app?(-|.)*.ts',
        },
        {
          type: 'core',
          pattern: 'core',
        },
        {
          type: 'ui',
          pattern: 'ui',
        },
        {
          type: 'layout',
          pattern: 'layout',
        },
        {
          type: 'pattern',
          pattern: 'pattern',
        },
        {
          type: 'feature-routes',
          mode: 'file',
          pattern: 'feature/*/*.routes.ts',
          capture: ['feature'],
        },
        {
          type: 'feature',
          pattern: 'feature/*',
          capture: ['feature'],
        },
        {
          type: 'test-files',
          mode: 'file',
          pattern: '*.spec.ts',
        },
        {
          type: 'page-object-files',
          mode: 'file',
          pattern: '*.po.ts',
        },
      ],
    },
  },
];
