import { IHardware } from './hardware.dto';

export type CpuDto = IHardware & {
  coreCount?: number;
  threadCount?: number;
  baseClock?: number;
  boostClock?: number;
};
