import { tags } from 'typia';

type IDatabaseConfigs = {
  DATABASE_URL: string & tags.Format<'url'>;
  DIRECT_URL: string & tags.Format<'url'>;
};

type ICacheConfigs = {
  REDIS_PORT: number & tags.Minimum<0> & tags.Maximum<65535>;
  REDIS_HOST: string;
  REDIS_USERNAME?: string; // only production
  REDIS_PASSWORD?: string; // only production
};

type IGoogleAIConfigs = {
  GOOGLE_API_KEY: string;
};

type ICrawlingConfigs = {
  KOREA_CRAWLING_BASE_URL: string & tags.Format<'url'>;
};

export type IConfiguration = IDatabaseConfigs &
  ICacheConfigs &
  IGoogleAIConfigs &
  ICrawlingConfigs;
