import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { GpuService } from '../../services/computer/gpu.service';
import { GpuRepository } from '../../repositories/computer/gpu.repository';

@Module({
  imports: [PrismaModule],
  providers: [GpuService, GpuRepository],
  exports: [GpuService, GpuRepository],
})
export class GpuModule {}
