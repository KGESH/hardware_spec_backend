import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';

import { AI_MODEL } from '../constants/ai.constants';
import { aiResponseSchema } from '../schemas/langchain.schema';
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);
  private retryCount = 0;

  constructor(
    @Inject(AI_MODEL)
    private readonly aiModel: ChatGoogleGenerativeAI,
  ) {}

  async chatToAI<T>({
    systemInput,
    userInput,
    responseSchema,
  }: {
    systemInput: string;
    userInput: string;
    responseSchema: z.ZodSchema<T>;
  }): Promise<z.infer<typeof responseSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(responseSchema);

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemInput],
      ['user', '{input}'],
    ]);

    const chain = RunnableSequence.from([prompt, this.aiModel, parser]);

    // Todo: handle retry

    try {
      const response = await chain.invoke({
        input: userInput,
      });

      this.retryCount = 0;
      return response;
    } catch (e) {
      this.logger.error(e);
      if (this.retryCount < 3) {
        this.retryCount++;
        this.logger.debug(`retry ${this.retryCount} times`);
        return this.chatToAI({
          systemInput:
            systemInput +
            `This is Error retry request. Before request got error. Usually field incorrect. Check one more time plz.`,
          userInput,
          responseSchema,
        });
      } else {
        throw new UnknownException(e);
      }
    }

    // const response = await chain.invoke({
    //   input: userInput,
    // });
  }
}
