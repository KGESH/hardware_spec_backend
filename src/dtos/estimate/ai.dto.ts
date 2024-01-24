import { z } from 'zod';
import { aiAnswerSchema } from '../../schemas/langchain.schema';

export type EstimateAIAnswerDto = z.infer<typeof aiAnswerSchema>;

export type EstimateAIPredictStatus = 'pending' | 'success' | 'error';

export type EstimateAIAnswerPendingDto = {
  status: 'pending';
};

export type EstimateAIAnswerErrorDto = {
  status: 'error';
  message: string;
};

export type EstimateAIAnswerSuccessDto = {
  status: 'success';
  estimates: EstimateAIAnswerDto[];
};

export type EstimateAIResponseDto =
  | EstimateAIAnswerSuccessDto
  | EstimateAIAnswerPendingDto
  | EstimateAIAnswerErrorDto;
