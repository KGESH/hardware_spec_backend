import { Injectable, Logger } from '@nestjs/common';
import {
  ComputerDto,
  SystemInfoDto,
  SystemInfoQuery,
} from '../../dtos/computer/computer.dto';
import { RedisService } from '../infra/redis.service';
import { REDIS_SYSTEM_INFO_PREFIX } from '../../constants/redis.constant';
import { CpuService } from './cpu.service';
import { IComputer } from '../../interfaces/computer/computer.interface';
import { GpuService } from './gpu.service';

@Injectable()
export class ComputerService {
  private readonly logger = new Logger(ComputerService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly cpuService: CpuService,
    private readonly gpuService: GpuService,
  ) {}

  async getComputer(dto: ComputerDto): Promise<IComputer> {
    // Todo: Add components
    const { cpu, gpu } = dto;

    let computer: IComputer = {};

    if (cpu) {
      const cpuSpec = await this.cpuService.createIfNotExists(cpu);
      computer = { ...computer, cpu: cpuSpec };
    }

    if (gpu) {
      const gpuSpec = await this.gpuService.createIfNotExists(gpu);
      computer = { ...computer, gpu: gpuSpec };
    }

    return computer;
  }

  async cacheComputerSpec(
    encodedId: string,
    dto: ComputerDto,
  ): Promise<string> {
    await this.redisService.setSerialize({
      prefix: REDIS_SYSTEM_INFO_PREFIX,
      key: encodedId,
      value: dto,
    });

    return encodedId;
  }

  async getCachedComputerSpec(encodedId: string): Promise<ComputerDto | null> {
    return await this.redisService.getDeserialize<ComputerDto>({
      prefix: REDIS_SYSTEM_INFO_PREFIX,
      key: encodedId,
    });
  }

  async getSystemInfo(query: SystemInfoQuery): Promise<SystemInfoDto | null> {
    const computerSpec = await this.getCachedComputerSpec(query.encodedId);

    // Todo: fetch DB

    if (!computerSpec) return null;

    return {
      encodedId: query.encodedId,
      computer: computerSpec,
    };
  }
}
