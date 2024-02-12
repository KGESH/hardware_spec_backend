import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigsService } from './configs.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
    }),
  ],
  providers: [ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
