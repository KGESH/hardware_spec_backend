import { tags } from 'typia';

export type IHardwareType = 'CPU' | 'GPU' | 'RAM' | 'M/B' | 'DISK' | 'OTHER';

export type IHardware = {
  id: string & tags.Format<'uuid'>;
  hwKey: string;
  vendorName: string;
  displayName: string;
  type: IHardwareType;
};
