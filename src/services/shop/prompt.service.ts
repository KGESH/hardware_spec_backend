import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../infra/redis.service';
import { REDIS_PROMPT_PREFIX } from '../../constants/redis.constant';
import {
  IPromptCache,
  IEstimatePrompt,
  ISystemPrompt,
  INormalizePromptTemplate,
} from '../../interfaces/ai/prompt.interface';
import { PricingTableService } from './pricingTable.service';
import { UnknownException } from '../../exceptions/unknown.exception';
import {
  IHardware,
  IHardwareType,
} from '../../interfaces/computer/hardware.interface';
import { ICpu } from '../../interfaces/computer/cpu.interface';
import { IDisk } from '../../interfaces/computer/disk.interface';
import { IGpu } from '../../interfaces/computer/gpu.interface';
import { IMotherboard } from '../../interfaces/computer/motherboard.interface';
import { IRam } from '../../interfaces/computer/ram.interface';
import {
  AI_PROMPT_CELERON_SERIES_NORMALIZE_TEMPLATE,
  AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE,
  AI_PROMPT_PENTIUM_SERIES_NORMALIZE_TEMPLATE,
  AI_PROMPT_RYZEN_SERIES_NORMALIZE_TEMPLATE,
  AI_PROMPT_SYSTEM_TEMPLATE,
} from '../../constants/prompt.constants';
import { checkCpuVendorByModelName } from '../../utils/brand/cpu/commonCpu.util';
import { getIntelBrand } from '../../utils/brand/cpu/intelCpu.util';
import { getAmdBrand } from '../../utils/brand/cpu/amdCpu.util';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  constructor(
    private readonly pricingTableService: PricingTableService,
    private readonly redisService: RedisService,
  ) {}

  buildPrompt(hardware: IHardware): IEstimatePrompt {
    const systemPromptTemplate = this._buildSystemPromptTemplate(hardware.type);
    const normalizePromptTemplate =
      this._buildNormalizePromptTemplate(hardware);
    const input = this._buildHardwareQueryInput(hardware);

    this.logger.debug(systemPromptTemplate, normalizePromptTemplate, input);
    return {
      systemPromptTemplate,
      normalizePromptTemplate,
      input,
    };
  }

  private _buildNormalizePromptTemplate(
    hardware: IHardware,
  ): INormalizePromptTemplate {
    switch (hardware.type) {
      case 'CPU':
        return this._buildNormalizeCpuPromptTemplate(hardware as ICpu);
      case 'GPU':
      case 'MB':
      case 'RAM':
      case 'DISK':
      case 'OTHER':
      default:
        throw new UnknownException({
          message: 'TODO: IMPLEMENT NORMALIZE PROMPT',
        });
    }
  }

  private _buildNormalizeCpuPromptTemplate(
    cpu: ICpu,
  ): INormalizePromptTemplate {
    const vendor = checkCpuVendorByModelName(cpu.hwKey);

    if (vendor === 'intel') {
      const intelBrand = getIntelBrand(cpu.hwKey);
      switch (intelBrand) {
        case 'core':
          return AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE;
        case 'pentium':
          return AI_PROMPT_PENTIUM_SERIES_NORMALIZE_TEMPLATE;
        case 'celeron':
          return AI_PROMPT_CELERON_SERIES_NORMALIZE_TEMPLATE;
      }
    } else {
      const amdBrand = getAmdBrand(cpu.hwKey);
      switch (amdBrand) {
        case 'ryzen':
          return AI_PROMPT_RYZEN_SERIES_NORMALIZE_TEMPLATE;
        case 'amd':
        default:
          throw new UnknownException({ message: 'TODO: IMPLEMENT AMD BRAND' });
      }
    }
  }

  private _buildSystemPromptTemplate(type: IHardwareType): ISystemPrompt {
    switch (type) {
      case 'CPU':
        return AI_PROMPT_SYSTEM_TEMPLATE('CPU');
      case 'GPU':
        return AI_PROMPT_SYSTEM_TEMPLATE('GPU');
      case 'MB':
        return AI_PROMPT_SYSTEM_TEMPLATE('Motherboard');
      case 'RAM':
        return AI_PROMPT_SYSTEM_TEMPLATE('RAM');
      case 'DISK':
        return AI_PROMPT_SYSTEM_TEMPLATE('Disk');
      default:
        throw new UnknownException({
          message: 'Unknown hardware type. buildSystemPrompt',
        });
    }
    // Todo: fetch from DB
    // const baseSystemPrompt = AI_SAMPLE_COMPUTER_PROMPT;
    //
    // const isCpuPricing =
    //   typia.validate<IHardwareWithPricing<ICpuDataset>[]>(pricingRows);
    // if (isCpuPricing.success) {
    //   const cpuPricingTable = isCpuPricing.data
    //     .map((row) => {
    //       return `[ ${row.type} | ${row.hardware.vendor} | ${row.hardware.category} | ${row.hardware.normalizedHwKey} | ${row.price} ]`;
    //     })
    //     .join('\n');
    //
    //   return this._buildPrompt(baseSystemPrompt, cpuPricingTable);
    // }
    //
    // // Todo: remove
    // return '';

    // const isGpuPricing = typia.validate<IHardwareWithPricing<IGpuDataset>[]>(pricingRows);
    // if (isGpuPricing.success) {
    //   const gpuPricingTable = isGpuPricing.data
    //     .map((row) => {
    //       return `[ ${row.type} | ${row.hardware.vendor} | ${row.hardware.category} | ${row.hardware.normalizedHwKey} | ${row.price} ]`;
    //     })
    //     .join('\n');
    //
    //   return this._buildPrompt(baseSystemPrompt, gpuPricingTable);
    // }
  }

  private _buildPrompt(
    baseSystemPrompt: string,
    cpuPricingTable: string,
  ): ISystemPrompt {
    const systemPrompt = baseSystemPrompt
      .concat('\n\n')
      .concat(`Here's the pricing table.\n`)
      .concat('=========================\n')
      .concat(cpuPricingTable)
      .concat('\n')
      .concat('=========================\n');
    return systemPrompt;
  }

  private _buildHardwareQueryInput(hardware: IHardware): string {
    switch (hardware.type) {
      case 'CPU':
        return hardware.hwKey;
      // const cpu = hardware as ICpu;
      // return `${cpu.vendorName} | ${cpu.displayName}`;
      // return `${cpu.displayName}`
      //   .concat(cpu?.coreCount ? ` / ${cpu.coreCount} cores` : '')
      //   .concat(cpu?.threadCount ? ` / ${cpu.threadCount} threads` : '')
      //   .concat(cpu?.baseClock ? ` / ${cpu.baseClock} GHz` : '')
      //   .concat(cpu?.boostClock ? `@ ${cpu.boostClock} GHz` : '');

      case 'GPU':
        const gpu = hardware as IGpu;
        return `${gpu.displayName} / ${gpu.vendorName}`.concat(
          gpu?.subVendorName ? ` / ${gpu.subVendorName}` : '',
        );

      case 'MB':
        const motherboard = hardware as IMotherboard;
        return `${motherboard.displayName}`
          .concat(motherboard?.vendorName ? ` / ${motherboard.vendorName}` : '')
          .concat(motherboard?.chipset ? ` / ${motherboard.chipset}` : '');

      case 'RAM':
        const ram = hardware as IRam;
        return `${ram.displayName} / ${ram.vendorName}`;

      case 'DISK':
        const disk = hardware as IDisk;
        return `${disk.displayName} / ${disk.vendorName}`
          .concat(disk?.kind ? ` / ${disk.kind}` : '')
          .concat(disk?.totalSpace ? ` / ${disk.totalSpace}` : '');

      default:
        throw new UnknownException({ message: 'buildPromptQueryForHardware' });
    }
  }
  async cachePrompt({ shopId, prompt }: IPromptCache): Promise<boolean> {
    return this.redisService.set({
      prefix: REDIS_PROMPT_PREFIX,
      key: shopId,
      value: prompt,
      expiry: 0,
    });
  }

  async getCachedPrompt(shopId: string): Promise<string | null> {
    return this.redisService.get<string>({
      prefix: REDIS_PROMPT_PREFIX,
      key: shopId,
    });
  }
}
