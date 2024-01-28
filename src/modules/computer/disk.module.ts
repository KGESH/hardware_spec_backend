import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { DiskService } from '../../services/computer/disk.service';
import { DiskRepository } from '../../repositories/computer/disk.repository';

@Module({
  imports: [PrismaModule],
  providers: [DiskService, DiskRepository],
  exports: [DiskService, DiskRepository],
})
export class DiskModule {}
