import { Injectable, Logger } from '@nestjs/common';
import { CpuService } from '../computer/cpu.service';
import { CpuEstimateRepository } from '../../repositories/estimate/cpuEstimate.repository';
import { ICpu, ICpuEstimate } from '../../interfaces/computer/cpu.interface';
import { AIRepository } from '../../repositories/ai/ai.repository';
import { IPartEstimateCreate } from '../../interfaces/estimate/part.interface';
import * as typia from 'typia';
import { UnknownException } from '../../exceptions/unknown.exception';
import { IAIAnswer } from '../../interfaces/ai/aiAnswer.interface';

@Injectable()
export class CpuEstimateService {
  private readonly logger = new Logger(CpuEstimateService.name);

  constructor(
    private readonly cpuService: CpuService,
    private readonly cpuEstimateRepository: CpuEstimateRepository,
    private readonly aiRepository: AIRepository,
  ) {}

  async createEstimate(dto: IPartEstimateCreate): Promise<{
    cpu: ICpu;
    aiAnswer: IAIAnswer;
    cpuEstimate: ICpuEstimate;
  }> {
    const aiAnswer = await this.aiRepository.create({
      name: dto.aiResponse.name,
      tablePrice: dto.aiResponse.tablePrice,
      buyingPrice: dto.aiResponse.buyingPrice,
      currency: dto.currency,
      metadata: null,
    });

    const cpuSpec = typia.validate<ICpu>(dto.hardware);

    if (!cpuSpec.success)
      throw new UnknownException({ message: 'Invalid CPU Spec' });

    const cpu = await this.cpuService.createIfNotExists(cpuSpec.data);

    const cpuEstimate = await this.cpuEstimateRepository.create({
      hardwareId: cpu.id,
      estimateId: dto.estimateId,
      shopId: dto.shopId,
      aiAnswerId: aiAnswer.id,
    });

    return {
      cpu,
      aiAnswer,
      cpuEstimate,
    };
  }
}
