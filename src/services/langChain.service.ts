import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { AI_MODEL } from '../constants/ai.constants';
import { z } from 'zod';
import { UnknownException } from '../exceptions/unknown.exception';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);

  constructor(
    @Inject(AI_MODEL)
    private readonly aiModel: ChatGoogleGenerativeAI,
  ) {}

  async chatToAI<T>({
    systemInput,
    query,
    responseSchema,
  }: {
    systemInput: string;
    query: string;
    responseSchema: z.ZodSchema<T>;
  }): Promise<z.infer<typeof responseSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(responseSchema);
    const prompt = ChatPromptTemplate.fromMessages<{
      query: string;
    }>([
      ['system', systemInput],
      ['human', '{query}'],
    ]);

    const chain = RunnableSequence.from([prompt, this.aiModel, parser]);

    try {
      const aiResponse = await chain.invoke({ query });
      return aiResponse as T;
    } catch (e) {
      this.logger.error(e);
      throw new UnknownException(e);
    }
  }
}
