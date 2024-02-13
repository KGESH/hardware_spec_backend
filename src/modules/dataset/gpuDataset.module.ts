import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { KoreaCrawlingModule } from '../crawling/koreaCrawling.module';
import { GpuDatasetRepository } from '../../repositories/dataset/gpuDataset.repository';
import { GpuPricingRepository } from '../../repositories/shop/gpuPricing.repository';
import { GpuDatasetService } from '../../services/dataset/gpuDataset.service';

// Todo: extract to cpu dataset module
@Module({
  imports: [PrismaModule, KoreaCrawlingModule],
  providers: [GpuDatasetService, GpuDatasetRepository, GpuPricingRepository],
  exports: [GpuDatasetService, GpuDatasetRepository, GpuPricingRepository],
})
export class GpuDatasetModule {}
