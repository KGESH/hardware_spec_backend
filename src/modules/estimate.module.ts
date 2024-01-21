import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { EstimateController } from '../controllers/estimate.controller';

@Module({
  imports: [RedisModule],
  controllers: [EstimateController],
  providers: [],
  exports: [],
})
export class EstimateModule {}
