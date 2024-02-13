import { HardwareDto } from './hardware.dto';

export type CpuDto = HardwareDto & {
  vendorName: 'intel' | 'amd';
  coreCount: number;
  threadCount: number | null;
  baseClock: number | null;
  boostClock: number | null;
};
