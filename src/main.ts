import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BusinessExceptionFilter } from './filters/businessException.filter';
import { ConfigsService } from './configs/configs.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configsService = app.get(ConfigsService);

  app.enableCors();
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.REDIS,
      options: {
        host: configsService.env.REDIS_HOST,
        port: configsService.env.REDIS_PORT,
        username: configsService.env.REDIS_USERNAME,
        password: configsService.env.REDIS_PASSWORD,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(3030);
}
bootstrap();
