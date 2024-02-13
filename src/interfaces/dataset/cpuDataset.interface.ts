import { IHardwareDataset } from './hardwareDataset.interface';
import { ICpuVendor } from '../computer/cpu.interface';
import { IDatasetEmbeddings } from '../ai/embeddings.interface';

export type ICpuDataset = IHardwareDataset & {
  vendor: ICpuVendor | null;
  category: string;
};

export type ICpuDatasetQuery = Pick<ICpuDataset, 'normalizedHwKey'>;

export type ICpuDatasetCreate = Omit<ICpuDataset, 'id'>;

export type ICpuDatasetEmbeddings = IDatasetEmbeddings & {
  vendor: ICpuVendor;
};
