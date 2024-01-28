import { Module } from '@nestjs/common';
import { RedisModule } from '../infra/redis.module';
import { PrismaModule } from '../infra/prisma.module';
import { ComputerController } from '../../controllers/computer.controller';
import { ComputerService } from '../../services/computer/computer.service';
import { CpuModule } from './cpu.module';
import { GpuModule } from './gpu.module';
import { RamModule } from './ram.module';
import { DiskModule } from './disk.module';
import { MotherboardModule } from './motherboard.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    CpuModule,
    GpuModule,
    MotherboardModule,
    RamModule,
    DiskModule,
  ],
  controllers: [ComputerController],
  providers: [ComputerService],
  exports: [
    ComputerService,
    CpuModule,
    GpuModule,
    MotherboardModule,
    RamModule,
    DiskModule,
  ],
})
export class ComputerModule {}
