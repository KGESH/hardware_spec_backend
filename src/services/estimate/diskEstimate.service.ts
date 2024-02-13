import { Injectable, Logger } from '@nestjs/common';
import { DiskService } from '../computer/disk.service';
import { IDisk, IDiskEstimate } from '../../interfaces/computer/disk.interface';
import { DiskEstimateRepository } from '../../repositories/estimate/diskEstimate.repository';
import { IPartEstimateCreate } from '../../interfaces/estimate/part.interface';
import { IAIAnswer } from '../../interfaces/ai/aiAnswer.interface';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as typia from 'typia';

@Injectable()
export class DiskEstimateService {
  private readonly logger = new Logger(DiskEstimateService.name);

  constructor(
    private readonly diskService: DiskService,
    private readonly diskEstimateRepository: DiskEstimateRepository,
    private readonly aiRepository: AIRepository,
  ) {}

  async createEstimate(dto: IPartEstimateCreate): Promise<{
    disk: IDisk;
    aiAnswer: IAIAnswer;
    diskEstimate: IDiskEstimate;
  }> {
    const aiAnswer = await this.aiRepository.create({
      name: dto.hardware.displayName,
      tablePrice: dto.aiResponse.tablePrice,
      buyingPrice: dto.aiResponse.buyingPrice,
      currency: dto.currency,
      metadata: null,
    });

    const diskSpec = typia.validate<IDisk>(dto.hardware);

    if (!diskSpec.success)
      throw new UnknownException({ message: 'Invalid Disk Spec' });

    const disk = await this.diskService.createIfNotExists(diskSpec.data);

    const diskEstimate = await this.diskEstimateRepository.create({
      hardwareId: disk.id,
      estimateId: dto.estimateId,
      shopId: dto.shopId,
      aiAnswerId: aiAnswer.id,
    });

    return {
      disk,
      aiAnswer,
      diskEstimate,
    };
  }
}
