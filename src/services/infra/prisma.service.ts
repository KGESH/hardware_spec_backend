import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigsService } from '../../configs/configs.service';
import { isProduction } from '../../utils/production.util';

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

  async cleanDatabase() {
    if (isProduction()) return;

    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      console.log({ error });
    }
    //
    // const models = Object.keys(this).filter((key) => key[0] !== '_');
    //
    // return Promise.all(
    //   models.map((tableName) => {
    //     return this[tableName].deleteMany();
    //   }),
    // );
    // // const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    // // models.forEach((model) =>
    // //   this.logger.debug(`cleanDatabase: ${model.toString()}`),
    // // );
    // //
    // // return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
