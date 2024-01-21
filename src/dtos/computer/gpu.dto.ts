import { IHardware } from './hardware.dto';

export type IGpu = IHardware & {
  subVendorName?: string;
};
