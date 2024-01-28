import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma.module';
import { ShopService } from '../../services/shop/shop.service';
import { ShopRepository } from '../../repositories/shop/shop.repository';
import { ShopController } from '../../controllers/shop.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
  exports: [ShopService],
})
export class ShopModule {}
