import { BaseEntity } from './base-entity.interface';

export interface Action extends BaseEntity {
  name: string;
  // 0 - 10
  rate: number;
  comment?: string;
  history: Date[];
}
