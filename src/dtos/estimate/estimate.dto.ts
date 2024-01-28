import { tags } from 'typia';
import { ComputerDto } from '../computer/computer.dto';
import { HardwareDto } from '../computer/hardware.dto';
import { AIAnswerDto } from './ai.dto';

export type EstimateStatusDto =
  | 'draft' // estimate create by user.
  | 'estimated' // AI estimate done.
  | 'pickup' // The PC is being picked up for delivery
  | 'checking' // The PC is being checked by your company
  | 'approved' // The check is successful, and payment can be processed
  | 'paid' // Payment has been sent to the user
  | 'error';

export type EstimateCacheDto = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
};

export type EstimateRequestDto = {
  shopId: string & tags.Format<'uuid'>;
  estimateId: string & tags.Format<'uuid'>;
  computer: ComputerDto;
};

export type AIEstimatePartDto = {
  shopId: string & tags.Format<'uuid'>;
  hardware: HardwareDto;
  aiAnswer: AIAnswerDto;
};

export type AIEstimateDraftDto = EstimateCacheDto & {
  status: 'draft'; // I wanna only pick draft type from EstimateStatusDto
};

export type AIEstimatedDto = EstimateCacheDto & {
  status: 'estimated' | 'pickup' | 'checking' | 'approved' | 'paid';
  estimates: AIEstimatePartDto[];
};

export type AIEstimateErrorDto = EstimateCacheDto & {
  status: 'error';
  message: string;
};

export type AIEstimateResponseDto =
  | AIEstimatedDto
  | AIEstimateDraftDto
  | AIEstimateErrorDto;

// type EstimateCreateStatus = 'pending' | 'exist' | 'changed' | 'error';

export type EstimateCreateResponseDto = {
  status: EstimateStatusDto;
  shopId: string & tags.Format<'uuid'>;
  encodedId: string;
  estimateId: string;
};
