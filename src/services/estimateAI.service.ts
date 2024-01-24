import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from './langChain.service';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import {
  AI_SAMPLE_COMPUTER_PROMPT,
  AI_SAMPLE_SYSTEM_PROMPT,
} from '../constants/ai.constants';
import {
  EstimateAIAnswerDto,
  EstimateAIAnswerPendingDto,
  EstimateAIAnswerSuccessDto,
  EstimateAIResponseDto,
} from '../dtos/estimate/ai.dto';
import { aiAnswerSchema } from '../schemas/langchain.schema';
import { EstimateService } from './estimate.service';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(
    private readonly langChainService: LangChainService,
    private readonly estimateService: EstimateService,
  ) {}

  async requestEstimate(
    dto: EstimateRequestDto,
  ): Promise<EstimateAIResponseDto> {
    this.logger.debug(dto);
    const pending: EstimateAIAnswerPendingDto = {
      status: 'pending',
    };

    // Cache created status
    await this.estimateService.cacheEstimate(dto.encodedId, pending);

    const { cpu, gpu, motherboard, rams, disks } = dto.computer;

    const estimatePromises: Promise<EstimateAIAnswerDto>[] = [];

    if (cpu) {
      estimatePromises.push(
        this.langChainService.chatToAI<EstimateAIAnswerDto>({
          systemInput: AI_SAMPLE_COMPUTER_PROMPT,
          responseSchema: aiAnswerSchema,
          query: `${cpu.displayName}`
            .concat(cpu?.coreCount ? ` / ${cpu.coreCount} cores` : '')
            .concat(cpu?.threadCount ? ` / ${cpu.threadCount} threads` : '')
            .concat(cpu?.baseClock ? ` / ${cpu.baseClock} GHz` : '')
            .concat(cpu?.boostClock ? `@ ${cpu.boostClock} GHz` : ''),
        }),
      );
    }

    if (gpu) {
      estimatePromises.push(
        this.langChainService.chatToAI<EstimateAIAnswerDto>({
          systemInput: AI_SAMPLE_COMPUTER_PROMPT,
          responseSchema: aiAnswerSchema,
          // If sub vendor name exist then add it to query
          query: `${gpu.displayName} / ${gpu.vendorName}`.concat(
            gpu?.subVendorName ? ` / ${gpu.subVendorName}` : '',
          ),
        }),
      );
    }

    if (motherboard) {
      estimatePromises.push(
        this.langChainService.chatToAI<EstimateAIAnswerDto>({
          systemInput: AI_SAMPLE_COMPUTER_PROMPT,
          responseSchema: aiAnswerSchema,
          query: `${motherboard.displayName}`
            .concat(
              motherboard?.vendorName ? ` / ${motherboard.vendorName}` : '',
            )
            .concat(motherboard?.chipset ? ` / ${motherboard.chipset}` : ''),
        }),
      );
    }

    if (rams) {
      rams.forEach((ram) => {
        estimatePromises.push(
          this.langChainService.chatToAI<EstimateAIAnswerDto>({
            systemInput: AI_SAMPLE_COMPUTER_PROMPT,
            responseSchema: aiAnswerSchema,
            query: `${ram.displayName} / ${ram.vendorName}`,
          }),
        );
      });
    }

    if (disks) {
      disks.forEach((disk) => {
        estimatePromises.push(
          this.langChainService.chatToAI<EstimateAIAnswerDto>({
            systemInput: AI_SAMPLE_COMPUTER_PROMPT,
            responseSchema: aiAnswerSchema,
            query: `${disk.displayName} / ${disk.vendorName}`
              .concat(disk?.kind ? ` / ${disk.kind}` : '')
              .concat(disk?.totalSpace ? ` / ${disk.totalSpace}` : ''),
          }),
        );
      });
    }

    const aiResponsePromises = await Promise.allSettled(estimatePromises);
    const aiResponses = aiResponsePromises
      .filter((promise) => {
        if (promise.status === 'fulfilled') return promise;
        // Todo: handle AI error
        else this.logger.error(`AI RESPONSE ERROR`, promise.reason);
      })
      .map((p) => (p as PromiseFulfilledResult<EstimateAIAnswerDto>).value);

    // Cache AI Responses
    const done: EstimateAIResponseDto =
      aiResponses.length === 0
        ? {
            status: 'error',
            message: 'Estimate not created',
          }
        : {
            status: 'success',
            estimates: aiResponses,
          };

    await this.estimateService.cacheEstimate(dto.encodedId, done);

    return done;
  }
}
