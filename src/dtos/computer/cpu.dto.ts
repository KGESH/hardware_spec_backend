import { HardwareDto } from './hardware.dto';

export type CpuDto = HardwareDto & {
  coreCount: number;
  threadCount: number | null;
  baseClock: number | null;
  boostClock: number | null;
};

export type CpuCreateDto = Omit<CpuDto, 'type'>;

export type CpuQueryDto = Pick<CpuDto, 'hwKey'>;
