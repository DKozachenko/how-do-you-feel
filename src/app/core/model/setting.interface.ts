import { BaseEntity } from './base-entity.interface';

export const enum SettingsIds {
  ACTION_ORDER = 'action-order',
}

export interface Setting<T> extends BaseEntity {
  value: T;
}
