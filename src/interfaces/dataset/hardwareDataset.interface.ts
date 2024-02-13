import { tags } from 'typia';

export type IHardwareDataset = {
  id: string & tags.Format<'uuid'>;
  metadata: string | null;
  normalizedHwKey: string;
};
