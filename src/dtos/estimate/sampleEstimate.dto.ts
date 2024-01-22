import { tags } from 'typia';

export type SampleEstimateDto = {
  id: string & tags.Format<'uuid'>;
  sheets: string;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt?: string & tags.Format<'date-time'>;
};

export type SampleEstimateQueryDto = Pick<SampleEstimateDto, 'id'>;

export type SampleEstimateCreateDto = Pick<SampleEstimateDto, 'sheets'>;

export type SampleEstimateUpdateDto = Pick<SampleEstimateDto, 'id'> &
  Partial<SampleEstimateDto>;
