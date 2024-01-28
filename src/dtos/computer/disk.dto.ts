import { HardwareDto } from './hardware.dto';

export type DiskDto = HardwareDto & {
  kind?: string;
  totalSpace?: number;
};
