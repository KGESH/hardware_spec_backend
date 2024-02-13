import { tags } from 'typia';
import { ICpuVendor } from '../../interfaces/computer/cpu.interface';

export type CpuDatasetEmbeddingsDto = {
  vendor: ICpuVendor;
  urls: (string & tags.Format<'url'>)[];
  shopId: string & tags.Format<'uuid'>;
};
