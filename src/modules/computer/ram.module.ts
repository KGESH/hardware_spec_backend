import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { RamService } from '../../services/computer/ram.service';
import { RamRepository } from '../../repositories/computer/ram.repository';

@Module({
  imports: [PrismaModule],
  providers: [RamService, RamRepository],
  exports: [RamService, RamRepository],
})
export class RamModule {}
