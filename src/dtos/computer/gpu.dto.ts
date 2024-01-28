import { HardwareDto } from './hardware.dto';

export type GpuDto = HardwareDto & {
  chipset: string;
  subVendorName: string | null;
};
