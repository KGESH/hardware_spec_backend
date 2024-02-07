import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { CpuService } from '../../services/computer/cpu.service';
import { CpuRepository } from '../../repositories/computer/cpu.repository';
import { DatasetModule } from '../dataset/dataset.module';
import { CpuDatasetModule } from '../dataset/cpuDataset.module';

@Module({
  imports: [PrismaModule, CpuDatasetModule],
  providers: [CpuService, CpuRepository],
  exports: [CpuService, CpuRepository],
})
export class CpuModule {}
