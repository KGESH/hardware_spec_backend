import { IHardware } from './hardware.dto';

export type DiskDto = IHardware & {
  kind?: string;
  totalSpace?: number;
};
