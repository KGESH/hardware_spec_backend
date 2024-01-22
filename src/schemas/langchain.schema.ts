import { z } from 'zod';

export const currencySchema = z.union([
  z.literal('KRW'),
  z.literal('USD'),
  z.literal('JPY'),
]);

export const responseSchema = z.object({
  name: z.string(),
  tablePrice: z.number().positive(),
  buyingPrice: z.number().positive(),
  currency: currencySchema,
});
