import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../infra/redis.service';
import { REDIS_PROMPT_PREFIX } from '../../constants/redis.constant';
import {
  IPromptCache,
  IEstimatePrompt,
  ISystemPrompt,
} from '../../interfaces/ai/prompt.interface';
import { PricingTableService } from './pricingTable.service';
import { EntityNotfoundException } from '../../exceptions/entityNotfound.exception';
import { UnknownException } from '../../exceptions/unknown.exception';
import { IHardware } from '../../interfaces/computer/hardware.interface';
import { ICpu } from '../../interfaces/computer/cpu.interface';
import { IDisk } from '../../interfaces/computer/disk.interface';
import { IGpu } from '../../interfaces/computer/gpu.interface';
import { IMotherboard } from '../../interfaces/computer/motherboard.interface';
import { IRam } from '../../interfaces/computer/ram.interface';
import { IPricingTable } from '../../interfaces/shop/pricingTable.interface';
import { AI_SAMPLE_COMPUTER_PROMPT } from '../../constants/ai.constants';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  constructor(
    private readonly pricingTableService: PricingTableService,
    private readonly redisService: RedisService,
  ) {}

  async buildPrompt(
    shopId: string,
    hardware: IHardware,
  ): Promise<IEstimatePrompt> {
    const pricingTable = await this.pricingTableService.findPricingTable({
      shopId,
      type: hardware.type,
    });

    // Todo: crawling pricing table

    if (!pricingTable) {
      throw new EntityNotfoundException({ message: `Pricing table not found` });
    }

    const systemPrompt = this._buildSystemPrompt(pricingTable);

    const query = this._buildHardwareSpecPrompt(hardware);

    return {
      system: systemPrompt,
      hardwareSpec: query,
    };
  }

  private _buildSystemPrompt(pricingTable: IPricingTable): ISystemPrompt {
    // Todo: fetch from DB
    const baseSystemPrompt = AI_SAMPLE_COMPUTER_PROMPT;

    const systemPrompt = baseSystemPrompt
      .concat('\n\n')
      .concat(`Here's the pricing table for ${pricingTable.type}.\n\n`)
      .concat(pricingTable.sheets);

    return systemPrompt;
  }

  private _buildHardwareSpecPrompt(hardware: IHardware): string {
    switch (hardware.type) {
      case 'CPU':
        const cpu = hardware as ICpu;
        return `${cpu.displayName}`
          .concat(cpu?.coreCount ? ` / ${cpu.coreCount} cores` : '')
          .concat(cpu?.threadCount ? ` / ${cpu.threadCount} threads` : '')
          .concat(cpu?.baseClock ? ` / ${cpu.baseClock} GHz` : '')
          .concat(cpu?.boostClock ? `@ ${cpu.boostClock} GHz` : '');

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
        throw new UnknownException('buildPromptQueryForHardware');
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
