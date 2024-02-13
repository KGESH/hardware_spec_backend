import {
  IDatasetPricingCreate,
  IHardwarePricingQuery,
} from './pricingTable.interface';
import { ICpuDatasetCreate } from '../dataset/cpuDataset.interfaces';

export type ICpuPricingQuery = IHardwarePricingQuery;

export type ICpuPricingCreate = {
  datasetCreateDto: ICpuDatasetCreate;
  pricingTableRowCreateDto: Omit<IDatasetPricingCreate, 'datasetId'>;
};
