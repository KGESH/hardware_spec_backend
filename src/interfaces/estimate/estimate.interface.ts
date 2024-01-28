import { tags } from 'typia';
import { IPartEstimate } from './part.interface';

export type IEstimateStatus =
  | 'draft' // estimate create by user.
  | 'estimated' // AI estimate done.
  | 'pickup' // The PC is being picked up for delivery
  | 'checking' // The PC is being checked by your company
  | 'approved' // The check is successful, and payment can be processed
  | 'paid' // Payment has been sent to the user
  | 'error';

export type IEstimate = {
  id: string & tags.Format<'uuid'>;
  name: string;
  status: IEstimateStatus;
  parts: IPartEstimate[];
};

export type IEstimateQuery = Pick<IEstimate, 'id'>;

export type IEstimateCacheQuery = {
  estimateId: string & tags.Format<'uuid'>;
};

export type IEstimateCreate = Omit<IEstimate, 'id' | 'parts'>;

export type IEstimateUpdate = Pick<IEstimate, 'id'> & Partial<IEstimateCreate>;
