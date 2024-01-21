import { IHardware } from './hardware.dto';

export type ICpu = IHardware & {
  coreCount?: number;
  threadCount?: number;
  baseClock?: number;
  boostClock?: number;
};
