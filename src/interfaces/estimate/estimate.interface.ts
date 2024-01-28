import { tags } from 'typia';
import { ICountry } from '../common.interface';
import { IPartEstimate } from './part.interface';

export type IEstimate = {
  id: string & tags.Format<'uuid'>;
  name: string;
  country: ICountry;
  parts: IPartEstimate[];
};

export type IEstimateCacheQuery = {
  estimateId: string & tags.Format<'uuid'>;
};

export type IEstimateCreate = Omit<IEstimate, 'parts'>;

export type IEstimateUpdate = Pick<IEstimate, 'id'> & Partial<IEstimateCreate>;
