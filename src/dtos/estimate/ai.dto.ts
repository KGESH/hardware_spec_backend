import { z } from 'zod';
import { aiAnswerSchema } from '../../schemas/langchain.schema';
import { tags } from 'typia';
import { IHardware } from '../computer/hardware.dto';

export type AIEstimateAnswerDto = z.infer<typeof aiAnswerSchema>;

export type AIEstimatePartDto = {
  shopId: string & tags.Format<'uuid'>;
  hardware: IHardware;
  estimate: AIEstimateAnswerDto;
};

export type AIEstimatePendingDto = {
  status: 'pending';
};

export type AIEstimateErrorDto = {
  status: 'error';
  message: string;
};

export type AIEstimateSuccessDto = {
  status: 'success';
  estimates: AIEstimatePartDto[];
};

export type AIEstimateResponseDto =
  | AIEstimateSuccessDto
  | AIEstimatePendingDto
  | AIEstimateErrorDto;
