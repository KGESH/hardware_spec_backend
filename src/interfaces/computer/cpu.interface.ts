import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type ICpu = IHardware & {
  type: 'CPU';
  coreCount: number;
  threadCount: number | null;
  baseClock: number | null;
  boostClock: number | null;
};

export type ICpuCreate = Omit<ICpu, 'id' | 'type'>;

export type ICpuQuery = Pick<ICpu, 'hwKey'>;

export type ICpuEstimate = IAIEstimate;

export type ICpuEstimateCreate = Omit<
  ICpuEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;