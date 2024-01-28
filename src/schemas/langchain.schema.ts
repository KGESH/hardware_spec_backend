import { z } from 'zod';

// Todo: AI response encoding 문제 고민
export const currencySchema = z
  .union([
    z.literal('KRW').describe('South Korea default currency.'),
    // z.union([
    //   z.string().describe('South Korea currency, KRW, ₩, Korean Won'),
    // ]),
    z.literal('USD').describe('United States default currency'),
    // z.union([
    //   z.string().describe('United States currency, USD, $, US Dollar'),
    // ]),
    z.literal('JPY').describe('Japan default currency'),
    // z.union([
    //   z.string().describe('Japan currency, JPY, ¥, Japanese Yen'),
    // ]),
  ])
  .describe('The currency of the hardware.');

export const aiAnswerSchema = z.object({
  name: z.string().describe(`The hardware's model name`),
  tablePrice: z.number().positive().describe(`The hardware's table price.`),
  buyingPrice: z
    .number()
    .positive()
    .describe(`The hardware's buying price. tablePrice's * 0.5`),
});
