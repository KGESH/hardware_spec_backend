import { FactoryProvider } from '@nestjs/common';
import { ConfigsService } from '../../../configs/configs.service';
import { AI_MODEL, AI_MODEL_NAME } from '../../../constants/ai.constants';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { UnknownException } from '../../../exceptions/unknown.exception';

const aiModelFactory: FactoryProvider = {
  inject: [ConfigsService],
  provide: AI_MODEL,
  useFactory: (configService: ConfigsService): ChatGoogleGenerativeAI => {
    try {
      return new ChatGoogleGenerativeAI({
        modelName: AI_MODEL_NAME,
        apiKey: configService.env.GOOGLE_API_KEY,
        maxOutputTokens: 1024,
        temperature: 0,
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize AI model',
      });
    }
  },
};

export const aiModelProviders = [aiModelFactory];
