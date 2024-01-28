import { tags } from 'typia';

export type IPromptCache = {
  shopId: string & tags.Format<'uuid'>;
  prompt: string;
};
