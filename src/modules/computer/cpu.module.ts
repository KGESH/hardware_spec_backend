import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { CpuService } from '../../services/computer/cpu.service';
import { CpuRepository } from '../../repositories/computer/cpu.repository';

@Module({
  imports: [PrismaModule],
  providers: [CpuService, CpuRepository],
  exports: [CpuService, CpuRepository],
})
export class CpuModule {}
