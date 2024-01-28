import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type IRam = IHardware;

export type IRamCreate = Omit<IRam, 'id' | 'type'>;

export type IRamQuery = Pick<IRam, 'hwKey'>;

export type IRamEstimate = IAIEstimate;

export type IRamEstimateCreate = Omit<
  IRamEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
