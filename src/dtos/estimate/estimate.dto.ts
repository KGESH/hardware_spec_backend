import { tags } from 'typia';
import { ComputerDto } from '../computer/computer.dto';

export type EstimateDto = {
  id: string & tags.Format<'uuid'>;
  name: string | null;
  cpuId: (string & tags.Format<'uuid'>) | null;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt?: string & tags.Format<'date-time'>;
};

export type EstimateCacheDto = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  encodedId: string;
};

export type EstimateCreateDto = Pick<EstimateDto, 'name' | 'cpuId'>;

export type EstimateUpdateDto = Pick<EstimateDto, 'id'> &
  Partial<EstimateCreateDto>;

export type EstimateQueryDto = Pick<EstimateDto, 'id'>;

export type EstimateRequestDto = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  encodedId: string;
  computer: ComputerDto;
};

type EstimateCreateStatus = 'pending' | 'exist' | 'changed' | 'error';

export type EstimateCreateResponseDto = {
  status: EstimateCreateStatus;
  shopId: string & tags.Format<'uuid'>;
  encodedId: string;
  estimateId: string;
};
