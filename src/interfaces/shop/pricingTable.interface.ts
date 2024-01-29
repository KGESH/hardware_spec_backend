import { tags } from 'typia';
import { IHardwareType } from '../computer/hardware.interface';

export type IPricingTable = {
  id: string & tags.Format<'uuid'>;
  shopId: string & tags.Format<'uuid'>;
  type: IHardwareType;
  sheets: string;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  deletedAt: (string & tags.Format<'date-time'>) | null;
};

export type IPricingTableQuery =
  | Pick<IPricingTable, 'id' | 'type'>
  | Pick<IPricingTable, 'shopId' | 'type'>;

export type IPricingTableCreate = Pick<
  IPricingTable,
  'sheets' | 'shopId' | 'type'
>;

export type IPricingTableUpdate = Pick<IPricingTable, 'id'> &
  Partial<IPricingTable>;
