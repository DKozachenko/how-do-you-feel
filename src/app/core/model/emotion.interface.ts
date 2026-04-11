import { BaseEntity } from './base-entity.interface';

export interface Emotion extends BaseEntity {
  name: string;
  comment?: string;
  color: string;
  dateTime: Date;
  private: boolean;
}
