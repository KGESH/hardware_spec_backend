import { tags } from 'typia';

export type IPromptCache = {
  shopId: string & tags.Format<'uuid'>;
  prompt: string;
};

export type ISystemPrompt = string;

export type IHardwarePrompt = string;

export type IEstimatePrompt = {
  system: ISystemPrompt;
  hardwareSpec: IHardwarePrompt;
};
