import { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';

/**
 * Конфигурация ESLint для порядка импортов в проекте.
 *
 * Этот конфиг применяется ко всем TypeScript и JavaScript файлам и использует
 * плагин `eslint-plugin-import` для управления порядком импортов.
 *
 * Включает правила сортировки по группам:
 *  - builtin — встроенные модули Node.js (fs, path и т.д.)
 *  - external — внешние зависимости из node_modules (@angular, rxjs, lodash и др.)
 *  - internal — внутренние алиасы и проектные файлы (src/app, @ui-lib/, @services/ и т.д.)
 *  - parent — импорты из родительских директорий (../module)
 *  - sibling — импорты из текущей директории (./module)
 *  - index — импорты из ./ или ./index
 */
export const importEslintConfig: Linter.Config[] = [
  {
    name: 'import-eslint/settings',
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
