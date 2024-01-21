import { Controller } from '@nestjs/common';
import { TypedRoute } from '@nestia/core';
import { IResponse } from '../dtos/response/response.dto';

@Controller('estimate')
export class EstimateController {
  constructor() {}

  @TypedRoute.Post('/')
  async createEstimate(): Promise<IResponse<boolean>> {
    return {
      status: 'success',
      data: true,
    };
  }
}
