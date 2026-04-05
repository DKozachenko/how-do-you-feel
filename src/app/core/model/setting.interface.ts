import { BaseEntity } from './base-entity.interface';

export interface Setting<T> extends BaseEntity {
  name: string;
  value: T;
}
