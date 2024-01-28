import { tags } from 'typia';

export type IHardwareType = 'CPU' | 'GPU' | 'RAM' | 'MB' | 'DISK' | 'OTHER';

export type IHardware = {
  id: string & tags.Format<'uuid'>;
  hwKey: string;
  vendorName: string;
  displayName: string;
  type: IHardwareType;
};
