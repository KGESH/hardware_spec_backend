import { tags } from 'typia';
import { IHardware } from '../computer/hardware.interface';
import { IAIAnswer, IAIResponse } from '../ai/aiAnswer.interface';
import { ICurrency } from '../common.interface';

export type IPartEstimate = {
  shopId: string & tags.Format<'uuid'>;
  hardware: IHardware;
  aiAnswer: IAIAnswer;
};

export type IPartEstimateCreate = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  hardware: IHardware;
  currency: ICurrency;
  aiResponse: IAIResponse;
};
