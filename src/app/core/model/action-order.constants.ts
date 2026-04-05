import { Setting } from './setting.interface';

export const enum ActionOrder {
  DEFAULT_ORDER = 'default-order',
  FRESHNESS_ORDER = 'freshness-order',
}

export const ACTION_ORDER_SETTING: Omit<Setting<ActionOrder>, 'id'> = {
  name: 'Порядок сортировки действий на страницах "Нравится" / "Не нравится"',
  value: ActionOrder.DEFAULT_ORDER,
};
