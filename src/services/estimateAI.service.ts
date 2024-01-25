import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from './langChain.service';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { AI_SAMPLE_COMPUTER_PROMPT } from '../constants/ai.constants';
import {
  AIEstimateAnswerDto,
  AIEstimateResponseDto,
  AIEstimatePartDto,
} from '../dtos/estimate/ai.dto';
import { aiAnswerSchema } from '../schemas/langchain.schema';
import { EstimateService } from './estimate.service';
import { IHardware } from '../dtos/computer/hardware.dto';
import { CpuDto } from '../dtos/computer/cpu.dto';
import { GpuDto } from '../dtos/computer/gpu.dto';
import { MotherboardDto } from '../dtos/computer/motherboard.dto';
import { RamDto } from '../dtos/computer/ram.dto';
import { DiskDto } from '../dtos/computer/disk.dto';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(
    private readonly langChainService: LangChainService,
    private readonly estimateService: EstimateService,
  ) {}

  async requestEstimate({
    shopId,
    encodedId,
    computer,
  }: EstimateRequestDto): Promise<AIEstimateResponseDto> {
    // Cache created status
    await this.estimateService.cacheEstimate(
      { shopId, encodedId },
      { status: 'pending' },
    );

    const { cpu, gpu, motherboard, rams, disks } = computer;
    const hardwareComponents: IHardware[] = [];

    if (cpu) hardwareComponents.push(cpu);
    if (gpu) hardwareComponents.push(gpu);
    if (motherboard) hardwareComponents.push(motherboard);
    if (rams) hardwareComponents.push(...rams);
    if (disks) hardwareComponents.push(...disks);

    const estimatePromises: Promise<AIEstimatePartDto>[] = [];
    const cachedEstimates: AIEstimatePartDto[] = [];

    // Fetch cached AI estimate parts.
    // If not found then create from AI
    for (const hardware of hardwareComponents) {
      const cachedEstimate = await this.estimateService.getCachedEstimatePart({
        shopId,
        hardware,
      });
      if (cachedEstimate) {
        cachedEstimates.push(cachedEstimate);
        continue;
      }
      estimatePromises.push(this._requestEstimateFromAI({ shopId, hardware }));
    }

    const aiResponsePromises = await Promise.allSettled(estimatePromises);

    const aiResponses = aiResponsePromises
      .filter((promise) => {
        if (promise.status === 'fulfilled') return promise;
        else this.logger.error(`AI RESPONSE ERROR`, promise.reason); // Todo: handle AI error
      })
      .map((p) => (p as PromiseFulfilledResult<AIEstimatePartDto>).value);

    // Cache new AI estimate parts
    const willCachePromises = aiResponses.map((aiResponse) => {
      return this.estimateService.cacheEstimatePart({
        ...aiResponse,
        expiry: 600, // seconds
      });
    });
    const cachedAIResponses = await Promise.allSettled(willCachePromises);
    cachedAIResponses.filter((promise) => {
      if (promise.status === 'fulfilled') return promise;
      else this.logger.error(`CACHE AI RESPONSE ERROR`, promise.reason); // Todo: handle AI error
    });

    // Final response
    const estimateDto: AIEstimateResponseDto =
      aiResponses.length === 0 && cachedEstimates.length === 0
        ? {
            status: 'error',
            message: 'Estimate not created',
          }
        : {
            status: 'success',
            estimates: [...cachedEstimates, ...aiResponses],
          };

    // Cache created estimate
    await this.estimateService.cacheEstimate(
      { shopId, encodedId },
      estimateDto,
    );

    return estimateDto;
  }

  private async _requestEstimateFromAI({
    shopId,
    hardware,
  }: Omit<AIEstimatePartDto, 'estimate'>): Promise<AIEstimatePartDto> {
    const query = this._buildPromptQueryForHardware(hardware);

    return this.langChainService
      .chatToAI<AIEstimateAnswerDto>({
        systemInput: AI_SAMPLE_COMPUTER_PROMPT,
        responseSchema: aiAnswerSchema,
        query,
      })
      .then((aiAnswer) => {
        return {
          shopId,
          hardware,
          estimate: aiAnswer,
        };
      });
  }

  private _buildPromptQueryForHardware(hardware: IHardware): string {
    // Construct and return the query string based on the specific hardware type and attributes

    switch (hardware.type) {
      case 'CPU':
        const cpu = hardware as CpuDto;
        return `${cpu.displayName}`
          .concat(cpu?.coreCount ? ` / ${cpu.coreCount} cores` : '')
          .concat(cpu?.threadCount ? ` / ${cpu.threadCount} threads` : '')
          .concat(cpu?.baseClock ? ` / ${cpu.baseClock} GHz` : '')
          .concat(cpu?.boostClock ? `@ ${cpu.boostClock} GHz` : '');

      case 'GPU':
        const gpu = hardware as GpuDto;
        return `${gpu.displayName} / ${gpu.vendorName}`.concat(
          gpu?.subVendorName ? ` / ${gpu.subVendorName}` : '',
        );

      case 'M/B':
        const motherboard = hardware as MotherboardDto;
        return `${motherboard.displayName}`
          .concat(motherboard?.vendorName ? ` / ${motherboard.vendorName}` : '')
          .concat(motherboard?.chipset ? ` / ${motherboard.chipset}` : '');

      case 'RAM':
        const ram = hardware as RamDto;
        return `${ram.displayName} / ${ram.vendorName}`;

      case 'DISK':
        const disk = hardware as DiskDto;
        return `${disk.displayName} / ${disk.vendorName}`
          .concat(disk?.kind ? ` / ${disk.kind}` : '')
          .concat(disk?.totalSpace ? ` / ${disk.totalSpace}` : '');

      default:
        throw new UnknownException('buildPromptQueryForHardware');
    }
  }
}
