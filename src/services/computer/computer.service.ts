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
import { MotherboardService } from './motherboard.service';
import { RamService } from './ram.service';
import { DiskService } from './disk.service';
import { ICpu } from '../../interfaces/computer/cpu.interface';
import { IGpu } from '../../interfaces/computer/gpu.interface';
import { IMotherboard } from '../../interfaces/computer/motherboard.interface';
import { IRam } from '../../interfaces/computer/ram.interface';
import { IDisk } from '../../interfaces/computer/disk.interface';
import { IHardware } from '../../interfaces/computer/hardware.interface';

@Injectable()
export class ComputerService {
  private readonly logger = new Logger(ComputerService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly cpuService: CpuService,
    private readonly gpuService: GpuService,
    private readonly motherboardService: MotherboardService,
    private readonly ramService: RamService,
    private readonly diskService: DiskService,
  ) {}

  async getComputer(dto: ComputerDto): Promise<IComputer> {
    const hardwareComponentPromises: Promise<IHardware>[] = [];

    if (dto.cpu) {
      const cpuPromise = this.cpuService.createIfNotExists(dto.cpu);
      hardwareComponentPromises.push(cpuPromise);
    }

    if (dto.gpu) {
      const gpuPromise = this.gpuService.createIfNotExists(dto.gpu);
      hardwareComponentPromises.push(gpuPromise);
    }

    if (dto.motherboard) {
      const motherboardPromise = this.motherboardService.createIfNotExists(
        dto.motherboard,
      );
      hardwareComponentPromises.push(motherboardPromise);
    }

    if (dto.rams) {
      const ramPromises = dto.rams.map((ramDto) =>
        this.ramService.createIfNotExists(ramDto),
      );
      hardwareComponentPromises.push(...ramPromises);
    }

    if (dto.disks) {
      const diskPromises = dto.disks.map((diskDto) =>
        this.diskService.createIfNotExists(diskDto),
      );
      hardwareComponentPromises.push(...diskPromises);
    }

    const hardwareComponentResults = await Promise.allSettled(
      hardwareComponentPromises,
    );

    // Todo: handle dataset not exist error
    const hardwareComponents = hardwareComponentResults
      .filter((promise) => {
        if (promise.status === 'fulfilled') return promise;
        else this.logger.error(`Get computer error`, promise.reason);
      })
      .map((p) => (p as PromiseFulfilledResult<IHardware>).value);

    const computer: IComputer = hardwareComponents.reduce(
      (computer, hardware) => {
        switch (hardware.type) {
          case 'CPU':
            return { ...computer, cpu: hardware as ICpu };
          case 'GPU':
            return { ...computer, gpu: hardware as IGpu };
          case 'MB':
            return { ...computer, motherboard: hardware as IMotherboard };
          case 'RAM':
            return { ...computer, rams: [...computer.rams, hardware as IRam] };
          case 'DISK':
            return {
              ...computer,
              disks: [...computer.disks, hardware as IDisk],
            };
          default:
            return computer;
        }
      },
      { rams: [], disks: [] } as IComputer,
    );

    return computer;
  }

  async cacheComputerSpec(
    encodedId: string,
    dto: ComputerDto,
  ): Promise<boolean> {
    return this.redisService.setSerialize({
      prefix: REDIS_SYSTEM_INFO_PREFIX,
      key: encodedId,
      value: dto,
    });
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
