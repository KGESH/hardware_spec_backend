import { Controller, Logger } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { SystemInfoDto } from '../dtos/computer/computer.dto';
import { ComputerService } from '../services/computer.service';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('computer')
export class ComputerController {
  private readonly logger = new Logger(ComputerController.name);
  constructor(private readonly computerService: ComputerService) {}

  @TypedRoute.Get('/:id')
  async getSystemInfo(
    @TypedParam('id') encodedId: string,
  ): Promise<ResponseDto<SystemInfoDto | null>> {
    const systemInfo = await this.computerService.getSystemInfo({ encodedId });

    if (!systemInfo) {
      throw new EntityNotfoundException({
        message: `Computer spec not found`,
      });
    }

    return {
      status: 'success',
      data: systemInfo,
    };
  }
}
