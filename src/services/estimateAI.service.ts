import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);
  constructor() {}

  async requestEstimate(encodedId: string): Promise<any> {}
}
