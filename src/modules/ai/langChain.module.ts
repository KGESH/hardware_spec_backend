import { FactoryProvider, Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { AI_MODEL, AI_MODEL_NAME } from '../../constants/ai.constants';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { UnknownException } from '../../exceptions/unknown.exception';
import { LangChainService } from '../../services/ai/langChain.service';
import { ConfigsService } from '../../configs/configs.service';

const aiModelFactory: FactoryProvider = {
  inject: [ConfigsService],
  provide: AI_MODEL,
  useFactory(configService: ConfigsService): ChatGoogleGenerativeAI {
    try {
      return new ChatGoogleGenerativeAI({
        modelName: AI_MODEL_NAME,
        apiKey: configService.env.GOOGLE_API_KEY,
        maxOutputTokens: 1024,
        temperature: 0,
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
