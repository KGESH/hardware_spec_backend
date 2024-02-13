import { Module } from '@nestjs/common';
import { DatasetController } from '../../controllers/dataset.controller';
import { CpuDatasetModule } from './cpuDataset.module';
import { GpuDatasetModule } from './gpuDataset.module';

// Todo: extract to cpu dataset module
@Module({
  imports: [CpuDatasetModule, GpuDatasetModule],
  controllers: [DatasetController],
})
export class DatasetModule {}
