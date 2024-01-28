import { tags } from 'typia';
import { ComputerDto } from '../computer/computer.dto';

export type EstimateCacheDto = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  encodedId: string;
};

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
