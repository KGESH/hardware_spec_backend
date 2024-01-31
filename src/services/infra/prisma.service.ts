import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigsService } from '../../configs/configs.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigsService) {
    super({ datasourceUrl: configService.env.DATABASE_URL });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');
  }
}
