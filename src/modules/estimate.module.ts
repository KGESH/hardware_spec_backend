import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { EstimateController } from '../controllers/estimate.controller';
import { EventPublishModule } from './eventPublish.module';
import { PrismaModule } from './prisma.module';
import { EstimateService } from '../services/estimate.service';
import { EstimateRepository } from '../repositories/estimate.repository';
import { SampleEstimateRepository } from '../repositories/sampleEstimate.repository';
import { ComputerModule } from './computer.module';

@Module({
  imports: [PrismaModule, RedisModule, EventPublishModule, ComputerModule],
  controllers: [EstimateController],
  providers: [EstimateService, EstimateRepository, SampleEstimateRepository],
  exports: [EstimateService],
})
export class EstimateModule {}
