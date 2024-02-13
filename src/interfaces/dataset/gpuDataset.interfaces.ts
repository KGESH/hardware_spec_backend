import { IHardwareDataset } from './hardwareDataset.interfaces';
import { IGpuVendor } from '../computer/gpu.interface';

export type IGpuDataset = IHardwareDataset & {
  category: string;
  vendor: IGpuVendor | null;
};

export type IGpuDatasetCreate = Omit<IGpuDataset, 'id'>;

export type IGpuDatasetQuery = Pick<IGpuDataset, 'normalizedHwKey'>;
