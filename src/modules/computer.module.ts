import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { PrismaModule } from './prisma.module';
import { ComputerController } from '../controllers/computer.controller';
import { ComputerService } from '../services/computer.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ComputerController],
  providers: [ComputerService],
  exports: [ComputerService],
})
export class ComputerModule {}
