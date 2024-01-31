import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './configs.types';
import { isProduction } from '../utils/production';
import { UnknownException } from '../exceptions/unknown.exception';
import * as typia from 'typia';

@Injectable()
export class ConfigsService {
  private readonly logger = new Logger(ConfigsService.name);
  private _env: IConfiguration;
  get env(): IConfiguration {
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

    const fromExternal = {
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: +(process.env.REDIS_PORT as string),
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      KOREA_CRAWLING_BASE_URL: process.env.KOREA_CRAWLING_BASE_URL,
    };

    const productionConfigs = typia.validate<IConfiguration>(fromExternal);

    if (productionConfigs.success) {
      this._env = productionConfigs.data;
    } else {
      throw new UnknownException(
        'ConfigsService production configs load error.',
        {
          message: 'Invalid env file',
          data: productionConfigs.errors,
        },
      );
    }
  }

  private _loadDevelopmentConfigs() {
    this.logger.verbose(`Load Development configuration`);

    const fromDotEnv = {
      DATABASE_URL: this.dotEnv.get('DATABASE_URL'),
      DIRECT_URL: this.dotEnv.get('DIRECT_URL'),
      REDIS_HOST: this.dotEnv.get('REDIS_HOST'),
      REDIS_PORT: +this.dotEnv.get('REDIS_PORT'),
      GOOGLE_API_KEY: this.dotEnv.get('GOOGLE_API_KEY'),
      KOREA_CRAWLING_BASE_URL: this.dotEnv.get('KOREA_CRAWLING_BASE_URL'),
    };

    const devConfigs = typia.validate<IConfiguration>(fromDotEnv);

    if (devConfigs.success) {
      this._env = devConfigs.data;
    } else {
      throw new UnknownException('ConfigsService dev configs load error.', {
        message: 'Invalid env file',
        data: devConfigs.errors,
      });
    }

    this.logger.verbose(`Load dev configuration`);
  }
}
