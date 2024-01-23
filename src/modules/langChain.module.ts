import { FactoryProvider, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_MODEL, AI_MODEL_NAME } from '../constants/ai.constants';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { UnknownException } from '../exceptions/unknown.exception';
import { LangChainService } from '../services/langChain.service';

const aiModelFactory: FactoryProvider = {
  inject: [ConfigService],
  provide: AI_MODEL,
  useFactory(configService: ConfigService): ChatGoogleGenerativeAI {
    try {
      return new ChatGoogleGenerativeAI({
        modelName: AI_MODEL_NAME,
        maxOutputTokens: 1024,
        apiKey: configService.get('GOOGLE_API_KEY'),
      });
    } catch (e) {
      throw new UnknownException(e);
    }
  },
};

@Module({
  providers: [aiModelFactory, LangChainService],
  exports: [LangChainService],
})
export class LangChainModule {}
