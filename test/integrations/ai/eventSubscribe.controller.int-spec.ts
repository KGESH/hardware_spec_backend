import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventSubscribeModule } from '../../../src/modules/infra/eventSubscribe.module';
import { EventSubscribeController } from '../../../src/controllers/eventSubscribe.controller';
import { ConfigsModule } from '../../../src/configs/configs.module';
import { EstimateService } from '../../../src/services/estimate/estimate.service';
import { EstimateRequestDto } from '../../../src/dtos/estimate/estimate.dto';
import { ShopService } from '../../../src/services/shop/shop.service';
import { ICpu } from '../../../src/interfaces/computer/cpu.interface';
import { MockCpuHelper } from '../../helpers/random/cpu.helper';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { MockShopHelper } from '../../helpers/random/shop.helper';
import { RedisService } from '../../../src/services/infra/redis.service';
import { UnknownException } from '../../../src/exceptions/unknown.exception';
import { PrismaService } from '../../../src/services/infra/prisma.service';

describe('[EventSubscribeController]', () => {
  let estimateService: EstimateService;
  let shopService: ShopService;
  let controller: EventSubscribeController;
  let mockRedisService: DeepMockProxy<RedisService>;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule, EventSubscribeModule],
    })
      .overrideProvider(RedisService)
      .useValue(mockDeep<RedisService>())
      .setLogger(new Logger())
      .compile();

    estimateService = module.get(EstimateService);
    shopService = module.get(ShopService);
    mockRedisService = module.get(RedisService);
    controller = module.get(EventSubscribeController);
    prismaService = module.get(PrismaService);
  });

  beforeEach(() => {
    // Ignore REDIS cache
    mockRedisService.getDeserialize.mockResolvedValue(null);
  });

  afterEach(() => {
    mockRedisService.getDeserialize.mockReset();
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('[Init]', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('[RequestEstimate]', () => {
    it('should be get estimate from AI', async () => {
      const estimate = await estimateService.createEstimate({
        name: 'Mock Estimate',
        status: 'draft',
      });
      const shop = await shopService.create({
        ...MockShopHelper.createDto(),
        country: 'KR',
      });
      const cpu: ICpu = {
        ...MockCpuHelper.dto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Celeron(R) CPU G5900 @ 3.50GHz',
      };
      const requestDto: EstimateRequestDto = {
        encodedId: 'MOCK ID',
        shopId: shop.id,
        estimateId: estimate.id,
        computer: { cpu },
      };

      // Request estimate to AI
      const response = await controller.requestEstimate(requestDto);

      if (response.status === 'estimated') {
        const { aiAnswer } = response.estimates[0];
        const normalizedName = aiAnswer.name;
        const tablePrice = aiAnswer.tablePrice;
        const buyingPrice = tablePrice / 2;

        expect(normalizedName).toEqual('G5900');
        expect(tablePrice).toEqual(20000);
        expect(buyingPrice).toEqual(10000);
      } else {
        expect(response.status).toEqual('error');
        // Test fail. Need to check external AI service.
        // e.g. billing, network, etc.
        throw new UnknownException({
          message: '[Test] AI Estimate not created. Check AI service status.',
        });
      }
    }, 120000);
  });
});
