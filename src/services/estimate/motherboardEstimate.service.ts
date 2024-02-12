import { Injectable, Logger } from '@nestjs/common';
import { MotherboardService } from '../computer/motherboard.service';
import {
  IMotherboard,
  IMotherboardEstimate,
} from '../../interfaces/computer/motherboard.interface';
import { MotherboardEstimateRepository } from '../../repositories/estimate/motherboardEstimate.repository';
import { IPartEstimateCreate } from '../../interfaces/estimate/part.interface';
import { IAIAnswer } from '../../interfaces/ai/aiAnswer.interface';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as typia from 'typia';

@Injectable()
export class MotherboardEstimateService {
  private readonly logger = new Logger(MotherboardEstimateService.name);

  constructor(
    private readonly motherboardService: MotherboardService,
    private readonly motherboardEstimateRepository: MotherboardEstimateRepository,
    private readonly aiRepository: AIRepository,
  ) {}

  async createEstimate(dto: IPartEstimateCreate): Promise<{
    motherboard: IMotherboard;
    aiAnswer: IAIAnswer;
    motherboardEstimate: IMotherboardEstimate;
  }> {
    const aiAnswer = await this.aiRepository.create({
      name: dto.hardware.displayName,
      tablePrice: dto.aiResponse.tablePrice,
      buyingPrice: dto.aiResponse.buyingPrice,
      currency: dto.currency,
      metadata: null,
    });

    const motherboardSpec = typia.validate<IMotherboard>(dto.hardware);

    if (!motherboardSpec.success)
      throw new UnknownException({ message: 'Invalid M/B Spec' });

    const motherboard = await this.motherboardService.createIfNotExists(
      motherboardSpec.data,
    );

    const motherboardEstimate = await this.motherboardEstimateRepository.create(
      {
        hardwareId: motherboard.id,
        estimateId: dto.estimateId,
        shopId: dto.shopId,
        aiAnswerId: aiAnswer.id,
      },
    );

    return {
      motherboard,
      aiAnswer,
      motherboardEstimate,
    };
  }
}
