import { Module } from '@nestjs/common';
import { aiModelProviders } from './aiModel.factory';

@Module({
  providers: aiModelProviders,
  exports: aiModelProviders,
})
export class AiModelModule {}
