import { IHardware } from './hardware.dto';

export type MotherboardDto = IHardware & {
  chipset?: string;
};
