import { tags } from 'typia';

export type PromptCacheDto = {
  shopId: string & tags.Format<'uuid'>;
  prompt: string;
};
