import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsModule } from '../../../src/configs/configs.module';
import { CpuRepository } from '../../../src/repositories/computer/cpu.repository';
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
import { normalizeIntelCpuName } from '../../../src/utils/brand/cpu/intelCpu.util';
import { normalizeAmdCpuName } from '../../../src/utils/brand/cpu/amdCpu.util';

describe('[Spec] CpuRepository', () => {
  let cpuRepository: CpuRepository;
  let mockPrismaClient: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule],
      providers: [CpuRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    cpuRepository = module.get(CpuRepository);
    mockPrismaClient = module.get(PrismaService);
  });

  afterEach(() => {
    mockPrismaClient.cpu.findUniqueOrThrow.mockReset();
    mockPrismaClient.cpu.create.mockReset();
    mockPrismaClient.cpu.update.mockReset();
  });

  afterAll((done) => {
    done();
  });

  describe('[Init]', () => {
    it('should be defined', () => {
      expect(cpuRepository).toBeDefined();
    });
  });

  describe('[findBy]', () => {
    it('[success] should be find cpu by hwKey', async () => {
      const mockEntity = MockCpuHelper.entity();
      const mockCpu: ICpu = MockCpuHelper.create(mockEntity);
      const mockCpuQuery: ICpuQuery = { hwKey: mockCpu.hwKey };
      mockPrismaClient.cpu.findUniqueOrThrow.mockResolvedValue(mockEntity);

      const foundCpu = await cpuRepository.findBy(mockCpuQuery);
      expect(foundCpu?.id).toStrictEqual(mockCpu.id);
    });

    it('[exception] should be throw EntityNotfoundException', async () => {
      const mockCpuQuery: ICpuQuery = { hwKey: MockCpuHelper.randomId() };

      mockPrismaClient.cpu.findUniqueOrThrow.mockRejectedValue(
        mockPrismaEntityNotfoundError(`Cpu not found.`),
      );

      try {
        const willThrowEntityNotfoundException =
          await cpuRepository.findBy(mockCpuQuery);
      } catch (e) {
        expect(e).toBeInstanceOf(EntityNotfoundException);
      }
    });
  });

  describe('[create]', () => {
    it('[success] should be create INTEL cpu', async () => {
      const createDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        hwKey: '커피I7 8700K',
      };
      const mockCreatedCpu: cpu = {
        ...MockCpuHelper.entity(),
        hw_key: createDto.hwKey,
        normalized_hw_key: normalizeIntelCpuName(createDto.hwKey),
        model_name: 'Intel(R) Core(TM) i7-8700K CPU @ 3.70GHz',
        vendor: 'intel',
        core_count: createDto.coreCount,
        thread_count: createDto.threadCount,
        base_clock: createDto.baseClock,
        boost_clock: createDto.boostClock,
      };
      mockPrismaClient.cpu.create.mockResolvedValue(mockCreatedCpu);

      const normalizedHwKey = normalizeIntelCpuName(createDto.hwKey);
      const createdCpu = await cpuRepository.create(createDto, normalizedHwKey);

      expect(createdCpu.normalizedHwKey).toStrictEqual('i7 8700k');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });

    it('[success] should be create AMD cpu', async () => {
      const createDto: ICpuCreate = {
        ...MockCpuHelper.createDto(),
        hwKey: '라이젠9 라파엘7950X3D',
      };
      const mockCreatedCpu: cpu = {
        ...MockCpuHelper.entity(),
        hw_key: createDto.hwKey,
        normalized_hw_key: normalizeAmdCpuName(createDto.hwKey),
        model_name: 'AMD Ryzen™ 9 7950X3D',
        vendor: 'amd',
        core_count: createDto.coreCount,
        thread_count: createDto.threadCount,
        base_clock: createDto.baseClock,
        boost_clock: createDto.boostClock,
      };
      mockPrismaClient.cpu.create.mockResolvedValue(mockCreatedCpu);

      const normalizedHwKey = normalizeAmdCpuName(createDto.hwKey);
      const createdCpu = await cpuRepository.create(createDto, normalizedHwKey);

      expect(createdCpu.normalizedHwKey).toStrictEqual('ryzen9 7950x3d');
      expect(createdCpu.normalizedHwKey).toStrictEqual(normalizedHwKey);
    });
  });
});
