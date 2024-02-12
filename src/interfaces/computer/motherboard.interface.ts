import { IHardware } from './hardware.interface';
import { IAIEstimate } from '../ai/aiAnswer.interface';

export type IMotherboard = IHardware & {
  chipset: string;
};

export type IMotherboardCreate = Omit<
  IMotherboard,
  'id' | 'type' | 'normalizedHwKey'
>;

export type IMotherboardQuery = Pick<IMotherboard, 'hwKey'>;

export type IMotherboardEstimate = IAIEstimate;

export type IMotherboardEstimateCreate = Omit<
  IMotherboardEstimate,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
