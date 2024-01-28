import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { LangChainModule } from './langChain.module';

@Module({
  imports: [PrismaModule, LangChainModule],
  providers: [AIRepository],
  exports: [LangChainModule, AIRepository],
})
export class AIModule {}
