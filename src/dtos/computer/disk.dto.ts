import { IHardware } from './hardware.dto';

export type IDisk = IHardware & {
  kind?: string;
  totalSpace?: number;
};
