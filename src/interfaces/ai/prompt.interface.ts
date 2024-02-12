import { tags } from 'typia';

export type IPromptCache = {
  shopId: string & tags.Format<'uuid'>;
  prompt: string;
};

export type ISystemPrompt = string;

export type IPromptInput = string;

export type INormalizePromptTemplate = string;

export type IEstimatePrompt = {
  systemPromptTemplate: ISystemPrompt;
  normalizePromptTemplate: INormalizePromptTemplate;
  input: IPromptInput;
};
