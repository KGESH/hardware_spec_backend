import { z } from 'zod';
import { aiAnswerSchema } from '../../schemas/langchain.schema';
import { tags } from 'typia';
import { CurrencyDto } from '../common.dto';

export type AIEstimateAnswerDto = z.infer<typeof aiAnswerSchema>;

export type AIAnswerDto = AIEstimateAnswerDto & {
  id: string & tags.Format<'uuid'>;
  currency: CurrencyDto;
  metadata: string | null;
};
