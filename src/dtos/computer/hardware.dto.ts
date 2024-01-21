type IHardwareType = 'CPU' | 'GPU' | 'RAM' | 'M/B' | 'DISK' | 'Other';

export type IHardware = {
  vendorName: string;
  displayName: string;
  type: IHardwareType;
};
