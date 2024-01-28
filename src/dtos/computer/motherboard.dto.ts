import { HardwareDto } from './hardware.dto';

export type MotherboardDto = HardwareDto & {
  chipset: string;
};
