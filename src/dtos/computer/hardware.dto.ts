export type HardwareTypeDto = 'CPU' | 'GPU' | 'RAM' | 'MB' | 'DISK' | 'OTHER';

export type HardwareDto = {
  hwKey: string;
  vendorName: string;
  displayName: string;
  type: HardwareTypeDto;
};
