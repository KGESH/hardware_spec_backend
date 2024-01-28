import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type IDisk = IHardware & {
  kind: string;
  totalSpace: number;
};

export type IDiskCreate = Omit<IDisk, 'id' | 'type'>;

export type IDiskQuery = Pick<IDisk, 'hwKey'>;

export type IDiskEstimate = IAIEstimate;

export type IDiskEstimateCreate = Omit<
  IDiskEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;