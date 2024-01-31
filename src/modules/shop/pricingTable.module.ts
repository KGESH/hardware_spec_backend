import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { CpuPricingTableRepository } from '../../repositories/shop/cpuPricingTable.repository';
import { PricingTableService } from '../../services/shop/pricingTable.service';
import { GpuPricingTableRepository } from '../../repositories/shop/gpuPricingTable.repository';
import { MotherboardPricingTableRepository } from '../../repositories/shop/motherboardPricingTable.repository';
import { RamPricingTableRepository } from '../../repositories/shop/ramPricingTable.repository';
import { DiskPricingTableRepository } from '../../repositories/shop/diskPricingTable.repository';
import { PricingTableController } from '../../controllers/pricingTable.controller';
import { ShopModule } from './shop.module';
import { PromptService } from '../../services/shop/prompt.service';
import { RedisModule } from '../infra/redis.module';

@Module({
  imports: [PrismaModule, ShopModule, RedisModule],
  controllers: [PricingTableController],
  providers: [
    PromptService,
    PricingTableService,
    CpuPricingTableRepository,
    GpuPricingTableRepository,
    MotherboardPricingTableRepository,
    RamPricingTableRepository,
    DiskPricingTableRepository,
  ],
  exports: [PromptService, PricingTableService],
})
export class PricingTableModule {}
