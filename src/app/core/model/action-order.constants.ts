import { Setting, SettingsIds } from './setting.interface';

export enum ActionOrder {
  DEFAULT_ORDER = 'default-order',
  FRESHNESS_ORDER = 'freshness-order',
}

export const ACTION_ORDER_SETTING: Setting<ActionOrder> = {
  id: SettingsIds.ACTION_ORDER,
  value: ActionOrder.DEFAULT_ORDER,
};
