export type HardwareTypeDto = 'CPU' | 'GPU' | 'RAM' | 'M/B' | 'DISK' | 'OTHER';

export type HardwareDto = {
  hwKey: string;
  vendorName: string;
  displayName: string;
  type: HardwareTypeDto;
};
