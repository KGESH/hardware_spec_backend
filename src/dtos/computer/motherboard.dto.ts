import { IHardware } from './hardware.dto';

export type IMotherboard = IHardware & {
  chipset?: string;
};
