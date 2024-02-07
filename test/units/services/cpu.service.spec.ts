import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsModule } from '../../../src/configs/configs.module';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { cpu, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../src/services/infra/prisma.service';
import { MockCpuHelper } from '../../helpers/random/cpu.helper';
import {
  ICpu,
  ICpuCreate,
  ICpuQuery,
} from '../../../src/interfaces/computer/cpu.interface';
import { mockPrismaEntityNotfoundError } from '../../helpers/exceptions/mockPrisma.exception';
import { EntityNotfoundException } from '../../../src/exceptions/entityNotfound.exception';
import {
  normalizeIntelCpuModel,
  normalizeIntelCpuName,
} from '../../../src/utils/brand/cpu/intelCpu.util';
import { normalizeAmdCpuName } from '../../../src/utils/brand/cpu/amdCpu.util';
import { CpuService } from '../../../src/services/computer/cpu.service';
import { CpuRepository } from '../../../src/repositories/computer/cpu.repository';

describe('[Spec] CpuService', () => {
  let cpuService: CpuService;
  let mockCpuRepository: DeepMockProxy<CpuRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule],
      providers: [CpuService, CpuRepository],
    })
      .overrideProvider(CpuRepository)
      .useValue(mockDeep<CpuRepository>())
      .compile();

    cpuService = module.get(CpuService);
    mockCpuRepository = module.get(CpuRepository);
  });

  afterEach(() => {
    mockCpuRepository.create.mockReset();
    mockCpuRepository.findBy.mockReset();
    mockCpuRepository.createIfNotExist.mockReset();
  });

  afterAll((done) => {
    done();
  });

  describe('[Init]', () => {
    it('should be defined', () => {
      expect(cpuService).toBeDefined();
    });
  });

  describe('[findBy]', () => {
    it('[success] should be find cpu by hwKey', async () => {
      const mockCpu: cpu = MockCpuHelper.entity();
      const mockCpuQuery: ICpuQuery = { hwKey: mockCpu.hw_key };
      const cpu: ICpu = MockCpuHelper.transform(mockCpu);
      mockCpuRepository.findBy.mockResolvedValue(cpu);

      const foundCpu = await cpuService.findBy(mockCpuQuery);
      expect(foundCpu?.id).toStrictEqual(mockCpu.id);
    });

    it('[exception] should be receive null', async () => {
      const mockCpuQuery: ICpuQuery = { hwKey: MockCpuHelper.randomId() };
      mockCpuRepository.findBy.mockResolvedValue(null);

      const foundCpu = await cpuService.findBy(mockCpuQuery);
      expect(foundCpu).toBeNull();
    });
  });

  describe('[create]', () => {
    it('[success] should be create Intel Core i series cpu (i7-8700K)', async () => {
      const coreISeriesDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz',
      };
      const mockCoreISeriesCpu: ICpu = {
        ...coreISeriesDto,
        type: 'CPU',
        id: MockCpuHelper.randomId(),
        normalizedHwKey: 'i7 8700k',
      };
      mockCpuRepository.create.mockResolvedValue(mockCoreISeriesCpu);

      const normalizedHwKey = normalizeIntelCpuModel(coreISeriesDto.hwKey);
      const createdCpu = await cpuService.create(coreISeriesDto);

      expect(normalizedHwKey).toStrictEqual('i7 8700k');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });

    it('[success] should be create Intel Core i series cpu (i9-13900KS)', async () => {
      const coreISeriesDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Core(TM) i9-13900KS CPU @ 6.00GHz',
      };
      const mockCoreISeriesCpu: ICpu = {
        ...coreISeriesDto,
        type: 'CPU',
        id: MockCpuHelper.randomId(),
        normalizedHwKey: 'i9 13900ks',
      };
      mockCpuRepository.create.mockResolvedValue(mockCoreISeriesCpu);

      const normalizedHwKey = normalizeIntelCpuModel(coreISeriesDto.hwKey);
      const createdCpu = await cpuService.create(coreISeriesDto);

      expect(normalizedHwKey).toStrictEqual('i9 13900ks');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });

    it('[success] should be create Intel Core i series cpu (i9-14900KF)', async () => {
      const coreISeriesDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Core(TM) i9-14900KF CPU @ 6.00GHz',
      };
      const mockCoreISeriesCpu: ICpu = {
        ...coreISeriesDto,
        type: 'CPU',
        id: MockCpuHelper.randomId(),
        normalizedHwKey: 'i9 14900kf',
      };
      mockCpuRepository.create.mockResolvedValue(mockCoreISeriesCpu);

      const normalizedHwKey = normalizeIntelCpuModel(coreISeriesDto.hwKey);
      const createdCpu = await cpuService.create(coreISeriesDto);

      expect(normalizedHwKey).toStrictEqual('i9 14900kf');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });

    it('[success] should be create Intel Pentium series cpu (Pentium G645)', async () => {
      const coreISeriesDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Pentium(R) CPU G645 @ 2.90GHz',
      };
      const mockCoreISeriesCpu: ICpu = {
        ...coreISeriesDto,
        type: 'CPU',
        id: MockCpuHelper.randomId(),
        normalizedHwKey: 'g645',
      };
      mockCpuRepository.create.mockResolvedValue(mockCoreISeriesCpu);

      const normalizedHwKey = normalizeIntelCpuModel(coreISeriesDto.hwKey);
      const createdCpu = await cpuService.create(coreISeriesDto);

      expect(normalizedHwKey).toStrictEqual('g645');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });

    // Todo: Add more test cases for AMD CPU
  });
});
