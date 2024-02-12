import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironment } from './configs.types';
import { isProduction } from '../utils/production.util';
import { UnknownException } from '../exceptions/unknown.exception';
import * as typia from 'typia';
import * as process from 'process';

@Injectable()
export class ConfigsService {
  private readonly logger = new Logger(ConfigsService.name);
  private _env: IEnvironment;
  get env(): IEnvironment {
    return this._env;
  }

  constructor(private readonly dotEnv: ConfigService) {
    this._loadConfiguration();
  }

  private _loadConfiguration(): void {
    if (isProduction()) {
      this._loadProductionConfigs();
    } else {
      this._loadDevelopmentConfigs();
    }
  }

  private _loadProductionConfigs() {
    this.logger.verbose(`Load production configuration`);

    const fromExternal: IEnvironment = {
      DEBUG_SHOP_ID: process.env.DEBUG_SHOP_ID as string, // Todo: remove
      DATABASE_URL: process.env.DATABASE_URL as string,
      DIRECT_URL: process.env.DIRECT_URL as string,
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: +(process.env.REDIS_PORT as string),
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
      REDIS_URI: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
      VECTOR_STORE_URL: process.env.VECTOR_STORE_URL as string,
      KOREA_CRAWLING_BASE_URL: process.env.KOREA_CRAWLING_BASE_URL as string,
    };

    const productionConfigs = typia.validate<IEnvironment>(fromExternal);

    if (productionConfigs.success) {
      this._env = productionConfigs.data;
    } else {
      throw new UnknownException({
        message: 'ConfigsService production configs load error.',
        data: productionConfigs.errors,
      });
    }
  }

  private _loadDevelopmentConfigs() {
    this.logger.verbose(`Load Development configuration`);

    const fromDotEnv: IEnvironment = {
      DEBUG_SHOP_ID: this.dotEnv.get('DEBUG_SHOP_ID') as string, // Todo: remove
      DATABASE_URL: this.dotEnv.get('DATABASE_URL') as string,
      DIRECT_URL: this.dotEnv.get('DIRECT_URL') as string,
      REDIS_URI: `redis://${this.dotEnv.get('REDIS_HOST')}:${this.dotEnv.get('REDIS_PORT')}`,
      REDIS_HOST: this.dotEnv.get('REDIS_HOST') as string,
      REDIS_PORT: +this.dotEnv.get('REDIS_PORT'),
      REDIS_USERNAME: this.dotEnv.get('REDIS_USERNAME') as string,
      REDIS_PASSWORD: this.dotEnv.get('REDIS_PASSWORD') as string,
      VECTOR_STORE_URL: this.dotEnv.get('VECTOR_STORE_URL') as string,
      GOOGLE_API_KEY: this.dotEnv.get('GOOGLE_API_KEY') as string,
      KOREA_CRAWLING_BASE_URL: this.dotEnv.get(
        'KOREA_CRAWLING_BASE_URL',
      ) as string,
    };

    const devConfigs = typia.validate<IEnvironment>(fromDotEnv);

    if (devConfigs.success) {
      this._env = devConfigs.data;
    } else {
      throw new UnknownException({
        message: 'ConfigsService dev configs load error.',
        data: devConfigs.errors,
      });
    }

    this.logger.verbose(`Load dev configuration`);
  }
}
