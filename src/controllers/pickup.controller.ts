import { Controller, Logger } from '@nestjs/common';

@Controller('pickup')
export class PickupController {
  private readonly logger = new Logger(PickupController.name);

  constructor() {}
}
