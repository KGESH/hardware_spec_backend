import { IHardware } from './hardware.dto';

export type GpuDto = IHardware & {
  subVendorName?: string;
};
