import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KoreaCrawlingService } from '../../services/crawling/koreaCrawling.service';
import { ConfigsService } from '../../configs/configs.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigsService],
      useFactory: (configService: ConfigsService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.env.KOREA_CRAWLING_BASE_URL,
      }),
    }),
  ],
  providers: [KoreaCrawlingService],
  exports: [KoreaCrawlingService],
})
export class KoreaCrawlingModule {}
