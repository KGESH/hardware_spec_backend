import { tags } from 'typia';
import { HardwareTypeDto } from '../computer/hardware.dto';

export type PricingTableDto = {
  id: string & tags.Format<'uuid'>;
  shopId: string & tags.Format<'uuid'>;
  type: HardwareTypeDto;
  sheets: string;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt?: string & tags.Format<'date-time'>;
};

export type PricingTableQueryDto =
  | Pick<PricingTableDto, 'id'>
  | Pick<PricingTableDto, 'shopId' | 'type'>;

export type PricingTableCreateDto = Pick<PricingTableDto, 'sheets' | 'shopId'>;

export type PricingTableUpdateDto = Pick<PricingTableDto, 'id'> &
  Partial<PricingTableDto>;
