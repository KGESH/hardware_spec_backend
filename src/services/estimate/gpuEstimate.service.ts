import { Injectable, Logger } from '@nestjs/common';
import { GpuService } from '../computer/gpu.service';
import { IGpu, IGpuEstimate } from '../../interfaces/computer/gpu.interface';
import { GpuEstimateRepository } from '../../repositories/estimate/gpuEstimate.repository';
import { IPartEstimateCreate } from '../../interfaces/estimate/part.interface';
import { IAIAnswer } from '../../interfaces/ai/aiAnswer.interface';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as typia from 'typia';

@Injectable()
export class GpuEstimateService {
  private readonly logger = new Logger(GpuEstimateService.name);

  constructor(
    private readonly gpuService: GpuService,
    private readonly gpuEstimateRepository: GpuEstimateRepository,
    private readonly aiRepository: AIRepository,
  ) {}

  async createEstimate(dto: IPartEstimateCreate): Promise<{
    gpu: IGpu;
    aiAnswer: IAIAnswer;
    gpuEstimate: IGpuEstimate;
  }> {
    const aiAnswer = await this.aiRepository.create({
      name: dto.hardware.displayName,
      tablePrice: dto.aiResponse.tablePrice,
      buyingPrice: dto.aiResponse.buyingPrice,
      currency: dto.currency,
      metadata: null,
    });

    const gpuSpec = typia.validate<IGpu>(dto.hardware);

    if (!gpuSpec.success) throw new UnknownException('Invalid GPU Spec');

    const gpu = await this.gpuService.createIfNotExists(gpuSpec.data);

    const gpuEstimate = await this.gpuEstimateRepository.create({
      hardwareId: gpu.id,
      estimateId: dto.estimateId,
      shopId: dto.shopId,
      aiAnswerId: aiAnswer.id,
    });

    return {
      gpu,
      aiAnswer,
      gpuEstimate,
    };
  }
}
