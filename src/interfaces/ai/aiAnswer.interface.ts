import { z } from 'zod';
import { aiAnswerSchema } from '../../schemas/langchain.schema';
import { tags } from 'typia';
import { ICurrency } from '../common.interface';

export type IAIResponse = z.infer<typeof aiAnswerSchema>;

export type IAIAnswer = IAIResponse & {
  id: string & tags.Format<'uuid'>;
  currency: ICurrency;
  metadata: string | null;
};

export type IAIAnswerCreate = Omit<
  IAIAnswer,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IAIEstimate = {
  id: string & tags.Format<'uuid'>;
  hardwareId: string & tags.Format<'uuid'>;
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  aiAnswerId: string & tags.Format<'uuid'>;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt: (string & tags.Format<'date-time'>) | null;
};
