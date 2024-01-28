import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { MotherboardService } from '../../services/computer/motherboard.service';
import { MotherboardRepository } from '../../repositories/computer/motherboard.repository';

@Module({
  imports: [PrismaModule],
  providers: [MotherboardService, MotherboardRepository],
  exports: [MotherboardService, MotherboardRepository],
})
export class MotherboardModule {}
