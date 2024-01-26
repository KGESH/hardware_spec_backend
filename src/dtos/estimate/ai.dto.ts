import { z } from 'zod';
import { aiAnswerSchema } from '../../schemas/langchain.schema';
import { tags } from 'typia';
import { IHardware } from '../computer/hardware.dto';
import { EstimateCacheDto } from './estimate.dto';

export type AIEstimateAnswerDto = z.infer<typeof aiAnswerSchema>;

export type AIEstimatePartDto = {
  shopId: string & tags.Format<'uuid'>;
  hardware: IHardware;
  estimate: AIEstimateAnswerDto;
};

export type AIEstimatePendingDto = EstimateCacheDto & {
  status: 'pending';
};

export type AIEstimateErrorDto = EstimateCacheDto & {
  status: 'error';
  message: string;
};

export type AIEstimateSuccessDto = EstimateCacheDto & {
  status: 'success';
  estimates: AIEstimatePartDto[];
};

export type AIEstimateResponseDto =
  | AIEstimateSuccessDto
  | AIEstimatePendingDto
  | AIEstimateErrorDto;
