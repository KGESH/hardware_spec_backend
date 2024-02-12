import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type IGpuVendor = 'nvidia' | 'amd' | 'intel';

export type IGpu = IHardware & {
  chipset: string;
  subVendorName: string | null;
};

export type IGpuCreate = Omit<IGpu, 'id' | 'type' | 'normalizedHwKey'>;

export type IGpuQuery = Pick<IGpu, 'hwKey'>;

export type IGpuEstimate = IAIEstimate;

export type IGpuEstimateCreate = Omit<
  IGpuEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
