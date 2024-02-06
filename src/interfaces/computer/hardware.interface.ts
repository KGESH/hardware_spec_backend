import { tags } from 'typia';

export type IHardwareType = 'CPU' | 'GPU' | 'RAM' | 'MB' | 'DISK' | 'OTHER';

export type IHardware = {
  id: string & tags.Format<'uuid'>;
  hwKey: string; // From OS, unique per hardware
  vendorName: string;
  displayName: string;
  normalizedHwKey: string; // normalize hwKey, for search dataset.
  type: IHardwareType;
};
