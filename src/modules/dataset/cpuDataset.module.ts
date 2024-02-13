import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { CpuDatasetService } from '../../services/dataset/cpuDataset.service';
import { CpuDatasetRepository } from '../../repositories/dataset/cpuDataset.repository';
import { KoreaCrawlingModule } from '../crawling/koreaCrawling.module';
import { CpuPricingRepository } from '../../repositories/shop/cpuPricing.repository';
import { AIModule } from '../ai/ai.module';

// Todo: extract to cpu dataset module
@Module({
  imports: [PrismaModule, KoreaCrawlingModule, AIModule],
  providers: [CpuDatasetService, CpuDatasetRepository, CpuPricingRepository],
  exports: [CpuDatasetService, CpuDatasetRepository, CpuPricingRepository],
})
export class CpuDatasetModule {}
