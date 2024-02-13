import { Controller, Get, Logger } from '@nestjs/common';
import { CpuDatasetService } from '../services/dataset/cpuDataset.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { GpuDatasetService } from '../services/dataset/gpuDataset.service';
import { CpuDatasetEmbeddingsDto } from '../dtos/dataset/cpuDataset.dto';
import { ResponseDto } from '../dtos/response/response.dto';

@Controller('dataset')
export class DatasetController {
  private readonly logger = new Logger(DatasetController.name);

  constructor(
    private readonly cpuDatasetService: CpuDatasetService,
    private readonly gpuDatasetService: GpuDatasetService,
  ) {}

  // Todo: replace to post
  @Get('/cpu/:shopId')
  async getCpuDataset(@TypedParam('shopId') shopId: string) {
    // Todo: impl
    return await Promise.all([
      this.cpuDatasetService.createIntelCpuTable({ shopId }),
      this.cpuDatasetService.createAmdCpuTable({ shopId }),
    ]);
  }
  @TypedRoute.Post('/cpu')
  async createCpuEmbeddings(
    @TypedBody() dto: CpuDatasetEmbeddingsDto,
  ): Promise<ResponseDto<string>> {
    await this.cpuDatasetService.embeddingsCpuFromWeb(dto);
    return {
      status: 'success',
      data: 'done',
    };
  }

  @Get('/gpu/:shopId')
  async getGpuDataset(@TypedParam('shopId') shopId: string) {
    return await Promise.all([
      this.gpuDatasetService.createNvidiaGpuTable({ shopId }),
      this.gpuDatasetService.createAmdGpuTable({ shopId }),
    ]);
  }
}
