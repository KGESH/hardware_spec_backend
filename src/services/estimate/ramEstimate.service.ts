import { Injectable, Logger } from '@nestjs/common';
import { RamService } from '../computer/ram.service';
import { IRam, IRamEstimate } from '../../interfaces/computer/ram.interface';
import { RamEstimateRepository } from '../../repositories/estimate/ramEstimate.repository';
import { IPartEstimateCreate } from '../../interfaces/estimate/part.interface';
import { IAIAnswer } from '../../interfaces/ai/aiAnswer.interface';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as typia from 'typia';

@Injectable()
export class RamEstimateService {
  private readonly logger = new Logger(RamEstimateService.name);

  constructor(
    private readonly ramService: RamService,
    private readonly ramEstimateRepository: RamEstimateRepository,
    private readonly aiRepository: AIRepository,
  ) {}

  async createEstimate(dto: IPartEstimateCreate): Promise<{
    ram: IRam;
    aiAnswer: IAIAnswer;
    ramEstimate: IRamEstimate;
  }> {
    const aiAnswer = await this.aiRepository.create({
      name: dto.hardware.displayName,
      tablePrice: dto.aiResponse.tablePrice,
      buyingPrice: dto.aiResponse.buyingPrice,
      currency: dto.currency,
      metadata: null,
    });

    const ramSpec = typia.validate<IRam>(dto.hardware);

    if (!ramSpec.success) throw new UnknownException('Invalid RAM Spec');

    const ram = await this.ramService.createIfNotExists(ramSpec.data);

    const ramEstimate = await this.ramEstimateRepository.create({
      hardwareId: ram.id,
      estimateId: dto.estimateId,
      shopId: dto.shopId,
      aiAnswerId: aiAnswer.id,
    });

    return {
      ram,
      aiAnswer,
      ramEstimate,
    };
  }
}
