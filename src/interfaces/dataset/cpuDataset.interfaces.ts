import { IHardwareDataset } from './hardwareDataset.interfaces';
import { ICpuVendor } from '../computer/cpu.interface';

export type ICpuDataset = IHardwareDataset & {
  vendor: ICpuVendor | null;
  category: string;
};

export type ICpuDatasetQuery = Pick<ICpuDataset, 'normalizedHwKey'>;

export type ICpuDatasetCreate = Omit<ICpuDataset, 'id'>;
