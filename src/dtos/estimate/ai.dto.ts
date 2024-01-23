import { z } from 'zod';
import { aiResponseSchema } from '../../schemas/langchain.schema';

export type EstimateAIResponseDto = z.infer<typeof aiResponseSchema>;
