import { BaseEntity } from './base-entity.interface';

export interface Emotion extends BaseEntity {
  name: string;
  comment?: string;
  dateTime: Date;
}
