import { tags } from 'typia';

export type IHardwareType = 'CPU' | 'GPU' | 'RAM' | 'MB' | 'DISK' | 'OTHER';

export type IHardware = {
  id: string & tags.Format<'uuid'>;
  type: IHardwareType;
  vendorName: string;
  displayName: string;
  hwKey: string; // From OS, unique per hardware
  normalizedHwKey: string; // normalize hwKey, for search dataset.
};
