import { HardwareDto } from './hardware.dto';

type DiskKind = 'hdd' | 'ssd';

export type DiskDto = HardwareDto & {
  kind: DiskKind;
  totalSpace: number;
};
