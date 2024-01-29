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

@Module({
  imports: [PrismaModule, ShopModule],
  controllers: [PricingTableController],
  providers: [
    PricingTableService,
    CpuPricingTableRepository,
    GpuPricingTableRepository,
    MotherboardPricingTableRepository,
    RamPricingTableRepository,
    DiskPricingTableRepository,
  ],
  exports: [PricingTableService],
})
export class PricingTableModule {}
