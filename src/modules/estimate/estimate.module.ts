import { Module } from '@nestjs/common';
import { RedisModule } from '../infra/redis.module';
import { EstimateController } from '../../controllers/estimate.controller';
import { EventPublishModule } from '../infra/eventPublish.module';
import { PrismaModule } from '../infra/prisma.module';
import { EstimateService } from '../../services/estimate/estimate.service';
import { EstimateRepository } from '../../repositories/estimate/estimate.repository';
import { ComputerModule } from '../computer/computer.module';
import { AIModule } from '../ai/ai.module';
import { CpuEstimateService } from '../../services/estimate/cpuEstimate.service';
import { EstimatePartService } from '../../services/estimate/estimatePart.service';
import { GpuEstimateService } from '../../services/estimate/gpuEstimate.service';
import { MotherboardEstimateService } from '../../services/estimate/motherboardEstimate.service';
import { RamEstimateService } from '../../services/estimate/ramEstimate.service';
import { DiskEstimateService } from '../../services/estimate/diskEstimate.service';
import { CpuEstimateRepository } from '../../repositories/estimate/cpuEstimate.repository';
import { GpuEstimateRepository } from '../../repositories/estimate/gpuEstimate.repository';
import { MotherboardEstimateRepository } from '../../repositories/estimate/motherboardEstimate.repository';
import { RamEstimateRepository } from '../../repositories/estimate/ramEstimate.repository';
import { DiskEstimateRepository } from '../../repositories/estimate/diskEstimate.repository';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    EventPublishModule,
    ComputerModule,
    AIModule,
  ],
  controllers: [EstimateController],
  providers: [
    EstimateService,
    EstimateRepository,
    EstimatePartService,
    CpuEstimateService,
    CpuEstimateRepository,
    GpuEstimateService,
    GpuEstimateRepository,
    MotherboardEstimateService,
    MotherboardEstimateRepository,
    RamEstimateService,
    RamEstimateRepository,
    DiskEstimateService,
    DiskEstimateRepository,
  ],
  exports: [EstimateService, AIModule, ComputerModule],
})
export class EstimateModule {}
