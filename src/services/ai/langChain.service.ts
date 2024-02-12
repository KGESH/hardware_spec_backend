import { Inject, Injectable, Logger } from '@nestjs/common';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { AI_MODEL } from '../../constants/ai.constants';
import { z } from 'zod';
import { UnknownException } from '../../exceptions/unknown.exception';
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { IEstimatePrompt } from '../../interfaces/ai/prompt.interface';
import { AI_PROMPT_INPUT_TEMPLATE } from '../../constants/prompt.constants';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { VectorStore } from '@langchain/core/vectorstores';
import { formatDocumentsAsString } from 'langchain/util/document';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);

  constructor(
    @Inject(AI_MODEL)
    private readonly aiModel: BaseChatModel,
  ) {}

  async chatToAI<T>({
    estimatePrompt,
    responseSchema,
    vectorStore,
  }: {
    estimatePrompt: IEstimatePrompt;
    responseSchema: z.ZodSchema<T>;
    vectorStore: VectorStore;
  }): Promise<z.infer<typeof responseSchema>> {
    const parser = StructuredOutputParser.fromZodSchema(responseSchema);
    const prompt = ChatPromptTemplate.fromMessages<{ input: string }>([
      ['system', estimatePrompt.systemPromptTemplate],
      ['human', AI_PROMPT_INPUT_TEMPLATE],
    ]);
    const normalizeModelNamePrompt = PromptTemplate.fromTemplate(
      estimatePrompt.normalizePromptTemplate,
    );
    const normalizeNameChain = normalizeModelNamePrompt
      .pipe(this.aiModel)
      .pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      normalizeNameChain,
      {
        input: new RunnablePassthrough(),
        context: vectorStore
          .asRetriever({ k: 10, searchType: 'similarity' })
          .pipe(formatDocumentsAsString),
      },
      prompt,
      this.aiModel,
      parser,
    ]);

    try {
      const aiResponse = await chain.invoke({
        input: estimatePrompt.input,
      });
      this.logger.verbose(`CREATED AI RESPONSE`, aiResponse);

      return aiResponse as T;
    } catch (e) {
      throw new UnknownException(e);
    }
  }
}
