import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigsService } from '../../../configs/configs.service';
import {
  AI_EMBEDDING_MODEL_NAME,
  AI_EMBEDDINGS_MODEL,
} from '../../../constants/ai.constants';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { UnknownException } from '../../../exceptions/unknown.exception';

const aiEmbeddingsModelFactory: FactoryProvider = {
  inject: [ConfigsService],
  provide: AI_EMBEDDINGS_MODEL,
  useFactory: (configService: ConfigsService): GoogleGenerativeAIEmbeddings => {
    try {
      return new GoogleGenerativeAIEmbeddings({
        modelName: AI_EMBEDDING_MODEL_NAME,
        apiKey: configService.env.GOOGLE_API_KEY,
        onFailedAttempt: (err) => Logger.error(err),
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize AI embeddings model',
      });
    }
  },
};

export const aiEmbeddingsModelProviders = [aiEmbeddingsModelFactory];
