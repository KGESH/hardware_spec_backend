import { HardwareDto, HardwareTypeDto } from '../dtos/computer/hardware.dto';

export const REDIS = 'REDIS_FACTORY';
export const REDIS_PUB = 'REDIS_PUB';
export const REDIS_SYSTEM_INFO_PREFIX = 'SYSTEM_INFO';
export const REDIS_ESTIMATE_PREFIX = (shopId: string) => `ESTIMATE_${shopId}`;

export const REDIS_ESTIMATE_HARDWARE_PART_PREFIX = (type: HardwareTypeDto) =>
  `ESTIMATE_HARDWARE_${type}`;

export const REDIS_ESTIMATE_HARDWARE_PART_KEY = ({
  shopId,
  hardware,
}: {
  shopId: string;
  hardware: HardwareDto;
}) => `${shopId}_${hardware.hwKey}`;

export const REDIS_PROMPT_PREFIX = 'PROMPT';
