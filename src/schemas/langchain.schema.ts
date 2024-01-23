import { z } from 'zod';

export const currencySchema = z.union([
  z.literal('KRW').describe('South Korea currency, Korean Won, KRW, ₩'),
  z.literal('USD').describe('United States currency, US Dollar, USD, $'),
  z.literal('JPY').describe('Japan currency, Japanese Yen, JPY, ¥'),
]);

export const aiResponseSchema = z.object({
  name: z.string().describe(`The hardware's model name`),
  tablePrice: z.number().positive().describe(`The hardware's table price.`),
  buyingPrice: z
    .number()
    .positive()
    .describe(`The hardware's buying price. tablePrice's * 0.5`),
  currency: currencySchema,
});
