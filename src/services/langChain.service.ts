import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';

import { AI_MODEL } from '../constants/ai.constants';
import { responseSchema } from '../schemas/langchain.schema';
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);

  constructor(
    @Inject(AI_MODEL)
    private readonly aiModel: ChatGoogleGenerativeAI,
  ) {}

  async chatToAI({
    systemInput,
    userInput,
  }: {
    systemInput: string;
    userInput: string;
  }): Promise<z.infer<typeof responseSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(responseSchema);

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemInput],
      ['user', '{input}'],
    ]);

    const chain = RunnableSequence.from([prompt, this.aiModel, parser]);

    const response = await chain.invoke({
      input: userInput,
    });

    this.logger.debug(response);

    return response;
  }
}
