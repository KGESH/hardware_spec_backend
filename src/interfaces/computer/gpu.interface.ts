import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type IGpu = IHardware & {
  chipset: string;
  subVendorName: string | null;
};

export type IGpuCreate = Omit<IGpu, 'id' | 'type'>;

export type IGpuQuery = Pick<IGpu, 'hwKey'>;

export type IGpuEstimate = IAIEstimate;

export type IGpuEstimateCreate = Omit<
  IGpuEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
